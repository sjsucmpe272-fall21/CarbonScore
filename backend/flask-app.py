from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from pymongo import MongoClient
import argparse
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
import datetime
import joblib
import pickle
from mapping import *

app = Flask(__name__)
CORS(app)
state_names = []
county_names = []
offset_interval = 80000
row_count = 8614411
model_cs = ""
mapp = "map.pkl"
chartp = "charts.pkl"
pollp = "pollutant.pkl" 
model_map = pickle.load(open(mapp, 'rb'))
model_chart = pickle.load(open(chartp, 'rb'))
model_poll = pickle.load(open(pollp, 'rb'))
print("Training Model Loaded!!")
scaler = MinMaxScaler()

def connectToMongoCollection():
    # mongo_client = MongoClient("mongodb://localhost:27017/")
    # mongodb://user:password@server:port/
    parser = argparse.ArgumentParser()
    parser.add_argument('--user', help='MongoDB server username', required=True)
    parser.add_argument('--pwd', help='MongoDB server password', required=True)
    args = parser.parse_args()
    connect_uri = "mongodb+srv://" + args.user + ":" + args.pwd + "@cluster0.tqbki.mongodb.net/carbonScore?retryWrites=true&w=majority"
    mongo_client = MongoClient(connect_uri)
    global db
    db = mongo_client["carbonScore"]

def init_states():
    states_collection = db["states"]
    result = list(states_collection.find())
    for item in result:
        state_names.append(item['state'])

def init_counties():
    counties_collection = db['counties']
    result = list(counties_collection.find())
    for item in result:
        full_county_name = item['county']+', '+item['state']
        county_names.append(full_county_name)

def init_full_data():
    df = pd.read_csv("final.csv")
    df['date_local'] = pd.to_datetime(df['date_local'])
    df["year"] = pd.DatetimeIndex(df['date_local']).year  
    df["month"] = pd.DatetimeIndex(df['date_local']).month
    df["day"] = pd.DatetimeIndex(df['date_local']).day  
    return df

def get_model(df):
    df_extract = df[["state_code","county_code","site_num", "year","month","day","arithmetic_mean", "parameter_name"]]
    df_extract["state_code"] = df_extract["state_code"].astype(int)
    df_extract["county_code"] = df_extract["county_code"].astype(int)
    df_extract["site_num"] = df_extract["site_num"].astype(int)
    df_g = df_extract.groupby(["state_code", "county_code","site_num","year","month","day"])["arithmetic_mean"].mean().reset_index()
    X = df_g.drop(["arithmetic_mean"], axis=1)
    y = df_g[["arithmetic_mean"]]
    train_X = X[:1100000]
    test_X = X[1100000:]
    train_y = y[:1100000]
    test_y = y[1100000:]
    scaler = MinMaxScaler()
    train_scaled = scaler.fit_transform(train_X)
    test_scaled = scaler.fit_transform(test_X)
    xg = xgb.XGBRegressor()
    xg.fit(train_scaled, train_y)
    pred = xg.predict(test_scaled)
    print("MSE: ", mean_squared_error(pred, test_y))
    return xg, scaler

@app.route("/states")
def get_states():
    return jsonify(state_names)

@app.route("/counties")
def get_counties():
    return jsonify(county_names)

@app.route("/existing_CO_county")
def get_county_CO_level():
    county = request.args.get("county")
    year = int(request.args.get("year"))
    counties_collection = db['countywise_CO_yearly']
    find_str = {'county': county, 'year':  year}
    result = counties_collection.find_one(find_str)
    monthly_levels = result['CO_monthly']
    return jsonify(monthly_levels)

@app.route("/existing_CO_state")
def get_state_CO_level():
    state = request.args.get("state")
    year = int(request.args.get("year"))
    states_collection = db['statewise_CO_yearly']
    find_str = {'state': state, 'year': year}
    result = states_collection.find_one(find_str)
    monthly_levels = result['CO_monthly']
    return jsonify(monthly_levels)

@app.route("/existing_CO_score_county")
def get_county_CO_score():
    county = request.args.get("county")
    year = int(request.args.get("year"))
    counties_collection = db['county_CO_year_agg']
    find_str = {'county': county, 'year':  year}
    result = counties_collection.find_one(find_str)
    score = round(result['mean'], 3)
    return jsonify(score)

@app.route("/existing_CO_tax_county")
def get_county_CO_tax():
    county = request.args.get("county")
    year = int(request.args.get("year"))
    counties_collection = db['county_CO_year_agg']
    find_str = {'county': county, 'year': year}
    result = counties_collection.find_one(find_str)
    score = round(result['mean'], 3)
    tax = round((score * 4700), 2)
    return jsonify(tax)

@app.route("/existing_CO_score_state")
def get_state_CO_score():
    state = request.args.get("state")
    year = int(request.args.get("year"))
    states_collection = db['state_CO_year_agg']
    find_str = {'state': state, 'year':  year}
    result = states_collection.find_one(find_str)
    score = round(result['mean'], 3)
    return jsonify(score)

@app.route("/existing_CO_tax_state")
def get_state_CO_tax():
    state = request.args.get("state")
    year = int(request.args.get("year"))
    states_collection = db['state_CO_year_agg']
    find_str = {'state': state, 'year': year}
    result = states_collection.find_one(find_str)
    score = round(result['mean'], 3)
    tax = round((score * 4700), 2)
    return jsonify(tax)

@app.route("/existing_CO_score_cities")
def get_cities_CO_score():
    county = request.args.get("county")
    year = int(request.args.get("year"))
    cities_collection = db['city_CO_year_agg']
    find_str = {'county': county, 'year':  year}
    result = cities_collection.find(find_str)
    score_list = []
    for row in result:
        score = round(row['mean'], 3)
        score_list.append([row['city'], score])
    return jsonify(score_list)

@app.route("/s3")
def test_s3():
    bucket = 'elasticbeanstalk-us-west-1-647979114575'
    file = 'states-counties.csv'
    try:
        import boto3
        import pandas as pd
        print('hello testing env values')
        print(os.environ['AWS_ACCESS_KEY_ID'])
        print(os.environ['AWS_SECRET_ACCESS_KEY'])
        s3_client = boto3.client('s3')
        '''s3_client = boto3.client(
            "s3",
            aws_access_key_id='',
            aws_secret_access_key=''
        )'''
        response = s3_client.get_object(Bucket=bucket, Key=file)
        status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

        if status == 200:
            # print(f"Successful S3 get_object response. Status - {status}")
            states_df = pd.read_csv(response.get("Body"))
            df_head = states_df.head()
            return jsonify(df_head.values.tolist())
        else:
            return jsonify(f"Unsuccessful S3 get_object response. Status - {status}")
    except Exception as e:
        return jsonify(str(e))

@app.route("/s3-test")
def test_s3_small():
    bucket = 'elasticbeanstalk-us-west-1-647979114575'
    file = 'test-csv.csv'
    try:
        import boto3
        import pandas as pd
        print('hello testing env values')
        print(os.environ['AWS_ACCESS_KEY_ID'])
        print(os.environ['AWS_SECRET_ACCESS_KEY'])
        s3_client = boto3.client('s3')
        '''s3_client = boto3.client(
            "s3",
            aws_access_key_id='',
            aws_secret_access_key=''
        )'''
        response = s3_client.get_object(Bucket=bucket, Key=file)
        status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

        if status == 200:
            # print(f"Successful S3 get_object response. Status - {status}")
            test_str = pd.read_csv(response.get("Body"))
            return jsonify(test_str.head().values.tolist())
        else:
            return jsonify(f"Unsuccessful S3 get_object response. Status - {status}")
    except Exception as e:
        return jsonify(str(e))

@app.route("/getscore")
def get_carbon_score():
    state = str(request.args.get("state"))
    county = str(request.args.get("county"))
    year = int(request.args.get("year"))
    new_df = pd.DataFrame({"state_code":[state_mapping[state]], "county_code":[county_mapping[county]],  "year":[year]})
    print(new_df)
    scaled_val = scaler.fit_transform(new_df)
    cs = model_map.predict(scaled_val)[0]
    return jsonify({"Carbon Score":cs, "tax_amount": (cs*4700).round(2) })

@app.route("/getmap")
def get_map_score():
    ddict = {'state_code':[],
        'county_code':[],
        'year':[]
    }
    ddf = pd.DataFrame(ddict)
    state = str(request.args.get("state"))
    year = int(request.args.get("year"))
    state_code = state_mapping[state]
    #print(county_names['California'])
    for i in county_names_dict[state]:
        ddf.loc[len(ddf.index)] = [state_code, county_mapping[i], year]
    
    # new_df = pd.DataFrame({"state_code":[state_mapping[state]], "county_code":[county_mapping[county]],  "year":[year]})
    # print(new_df)
    scaled_val = scaler.fit_transform(ddf)
    cs = model_map.predict(scaled_val)
    print(cs)
    return jsonify({"Carbon Score":'test' })

# @app.route("/getpollutant")
# def get_pollutant_score():
#     # ddict = {'state_code':[],
#     #     'county_code':[],
#     #     'year':[]
#     # }
#     ddf = pd.DataFrame(ddict)
#     state = str(request.args.get("state"))
#     county = str(request.args.get("county"))
#     year = int(request.args.get("year"))
#     state_code = state_mapping[state]
#     new_df = pd.DataFrame({"state_code":[state_mapping[state]], "county_code":[county_mapping[county]],  "year":[year]})
#     print(new_df)
#     scaled_val = scaler.fit_transform(ddf)
#     cs = model_map.predict(scaled_val)
#     print(cs)
#     return jsonify({"Carbon Score":'test' })

if __name__ == '__main__':
    connectToMongoCollection()
    init_states()
    init_counties()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #ddf = init_full_data()
    #model_cs, scaler = get_model(ddf)
    #app.run(host="0.0.0.0")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))