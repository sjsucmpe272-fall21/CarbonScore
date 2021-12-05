from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from pymongo import MongoClient
import argparse
import pandas as pd
<<<<<<< HEAD
#import xgboost as xgb
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import mean_squared_error
import datetime
#import joblib
#import pickle
=======
import datetime
>>>>>>> 672c84182de5e38f5cba0a09ccbe0598bd50c0cf
from mapping import *
import boto3

app = Flask(__name__)
CORS(app)
state_names = []
county_names = []
offset_interval = 80000
row_count = 8614411
model_cs = ""
<<<<<<< HEAD
mapp = "map.pkl"
chartp = "charts.pkl"
pollp = "pollutant.pkl" 
statep = "statemap.pkl"
# s_map = pickle.load(open(mapp, 'rb'))
# s_chart = pickle.load(open(chartp, 'rb'))
# s_poll = pickle.load(open(pollp, 'rb'))
# s_smap = pickle.load(open(statep, 'rb'))
print("Training Model Loaded!!")
# scaler = MinMaxScaler()
=======
>>>>>>> 672c84182de5e38f5cba0a09ccbe0598bd50c0cf

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

@app.route("/predict_CO_score")
def get_CO_score_pred():
    state = request.args.get("state")
    county = request.args.get("county")
    year = int(request.args.get("year"))
    find_str = {"state_code":state_mapping[state],"county_code":county_mapping[county], "year":year}
    carbon_collection = db['predict_table']
    # find_str = {'county': county, 'year':  year}
    result = carbon_collection.find_one(find_str)
    cs = round(result["carbonscore"],3)
    return jsonify({"carbonscore":cs, "tax": round(cs*4700, 2)})

@app.route("/predict_CO_map")
def get_map_CO_score():
    ddict = {'state_code':[],
        'year':[]
    }
    op = []
    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    year = int(request.args.get("year"))
    map_collection = db['predict_map']
    for i in list(state_abb.keys()):
        if(i in list(state_mapping.keys())):
            ddf.loc[len(ddf.index)] = [state_mapping[i],  year]
            op.append(state_abb[i])
    for index,row in ddf.iterrows():
        result = map_collection.find_one({"state_code":row["state_code"],"year":year})
        fo.append(round(result["carbonscore"],3))
    return jsonify({"state":op, "carbonscore":fo})

@app.route("/predict_CO_pollmonth")
def get_line_CO_score():
    ddict = {'state_code':[],
        'county_code':[],
        'year':[],
        'month' : []
    }

    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    ddf["month"] = ddf["month"].astype(int)

    year = int(request.args.get("year"))
    state = request.args.get("state")
    county = request.args.get("county")

    line_collection = db['predict_line']
    state_code = state_mapping[state]
    county_code = county_mapping[county]
    
    for i in range(1,13):
        ddf.loc[len(ddf.index)] = [state_code,county_code , year, i]
    
    for index,row in ddf.iterrows():
        #print({"state_code":row["state_code"],"county_code":row["county_code"], "month":row["month"], "year":row["year"]})
        result = line_collection.find_one({"state_code":row["state_code"],"county_code":row["county_code"], "month":row["month"], "year":row["year"]})
        fo.append(round(result["carbonscore"],3))
    
    return jsonify({"x":chart_res, "y" :fo})

@app.route("/predict_CO_pollcity")
def get_bar_CO_score():
    ddict = {'state_code':[],
        'county_code':[],
        'year':[],
        'city_num' : []
    }

    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    ddf["city_num"] = ddf["city_num"].astype(int)

    year = int(request.args.get("year"))
    state = request.args.get("state")
    county = request.args.get("county")

    bar_collection = db['predict_bar']
    state_code = state_mapping[state]
    county_code = county_mapping[county]
    
    for i in city_detail[county]:
        ddf.loc[len(ddf.index)] = [state_code,county_code , year, city_mapping[i]]
    
    for index,row in ddf.iterrows():
        #print({"state_code":row["state_code"],"county_code":row["county_code"], "city_num":row["city_num"], "year":row["year"]})
        result = bar_collection.find_one({"state_code":row["state_code"],"county_code":row["county_code"], "city_num":row["city_num"], "year":row["year"]})
        fo.append(round(result["carbonscore"],3))
    
    return jsonify({"x":city_detail[county], "y" :fo})

@app.route("/predict_CO_table")
def get_table_CO_score():
    ddict = {'state_code':[],
        'county_code':[],
        'year':[]
    }

    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)


    year = int(request.args.get("year"))
    state = request.args.get("state")
    #county = request.args.get("county")

    table_collection = db['predict_table']
    state_code = state_mapping[state]
    #county_code = county_mapping[county]
    
    for i in county_names_dict[state]:
        ddf.loc[len(ddf.index)] = [state_code, county_mapping[i], year]
    
    for index,row in ddf.iterrows():
        #print({"state_code":row["state_code"],"county_code":row["county_code"], "year":row["year"]})
        result = table_collection.find_one({"state_code":row["state_code"],"county_code":row["county_code"], "year":row["year"]})
        fo.append(round(result["carbonscore"],3))
    
    return jsonify({"county":county_names_dict[state], "carbonscore": fo})
@app.route("/existing_state_map")
def get_state_map():
    year = int(request.args.get("year"))
    state_collection = db['state_CO_year_agg']
    find_str = {'year':  year}
    result = state_collection.find(find_str)
    score_list = []
    for row in result:
        score = round(row['mean'], 3)
        score_list.append([row['state'], score])
    return jsonify(score_list)

@app.route("/s3")
def test_s3():
    bucket = 'elasticbeanstalk-us-west-1-647979114575'
    file = 'states-counties.csv'
    try:
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
        print('hello testing env values')
        # print(os.environ['AWS_ACCESS_KEY_ID'])
        # print(os.environ['AWS_SECRET_ACCESS_KEY'])
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
            print(response.get("Body"))
            test_str = pd.read_csv(response.get("Body"))
            return jsonify(test_str.head().values.tolist())
        else:
            return jsonify(f"Unsuccessful S3 get_object response. Status - {status}")
    except Exception as e:
        return jsonify(str(e))

@app.route("/predict_CO_score")
def get_CO_score_pred():
    state = request.args.get("state")
    county = request.args.get("county")
    year = int(request.args.get("year"))
    find_str = {"state_code": int(state_mapping[state]), "county_code": int(county_mapping[county]), "year": int(year)}
    carbon_collection = db['predict_table']
    # find_str = {'county': county, 'year':  year}
    result = carbon_collection.find_one(find_str)
    cs = round(result["carbonscore"], 3)
    return jsonify({"carbonscore": cs, "tax": round(cs * 4700, 2)})


@app.route("/predict_CO_map")
def get_map_CO_score():
    ddict = {'state_code': [],
             'year': []
             }
    op = []
    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    year = int(request.args.get("year"))
    map_collection = db['predict_map']
    for i in list(state_abb.keys()):
        if (i in list(state_mapping.keys())):
            ddf.loc[len(ddf.index)] = [state_mapping[i], year]
            op.append(state_abb[i])
    for index, row in ddf.iterrows():
        result = map_collection.find_one({"state_code": int(row["state_code"]), "year": int(year)})
        fo.append(round(result["carbonscore"], 3))
    return jsonify({"state": op, "carbonscore": fo})


@app.route("/predict_CO_pollmonth")
def get_line_CO_score():
    ddict = {'state_code': [],
             'county_code': [],
             'year': [],
             'month': []
             }

    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    ddf["month"] = ddf["month"].astype(int)

    year = int(request.args.get("year"))
    state = request.args.get("state")
    county = request.args.get("county")

    line_collection = db['predict_line']
    state_code = state_mapping[state]
    county_code = county_mapping[county]

    for i in range(1, 13):
        ddf.loc[len(ddf.index)] = [state_code, county_code, year, i]

    for index, row in ddf.iterrows():
        # print({"state_code":row["state_code"],"county_code":row["county_code"], "month":row["month"], "year":row["year"]})
        result = line_collection.find_one(
            {"state_code": int(row["state_code"]), "county_code": int(row["county_code"]), "month": int(row["month"]),
             "year": int(row["year"])})
        fo.append(round(result["carbonscore"], 3))

    return jsonify({"x": chart_res, "y": fo})


@app.route("/predict_CO_pollcity")
def get_bar_CO_score():
    ddict = {'state_code': [],
             'county_code': [],
             'year': [],
             'city_num': []
             }

<<<<<<< HEAD
        if status == 200:
            ddict = {'state_code':[],
                'county_code':[],
                'year':[],
                'city_num' : []
            }
            ddf = pd.DataFrame(ddict)
            state = str(request.args.get("state"))
            year = int(request.args.get("year"))
            county = str(request.args.get("county"))
            state_code = state_mapping[state]
            county_code = county_mapping[county]
            #print(county_names['California'])
            for i in city_detail[county]:
                ddf.loc[len(ddf.index)] = [state_code,county_code , year, city_mapping[i]]
            scaled_val = scaler.fit_transform(ddf)
            model_chart = pickle.loads(response.get("Body").read())
            cs = model_chart.predict(scaled_val)
            cs = [i.round(2) for i in cs]
            res = {"x":city_detail[county], "y" :cs}
            return jsonify(res)
        else:
            return jsonify(f"Unsuccessful S3 get_object response. Status - {status}")
    except Exception as e:
        #print(e)
        return jsonify(str(e))
=======
    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)
    ddf["city_num"] = ddf["city_num"].astype(int)
>>>>>>> 672c84182de5e38f5cba0a09ccbe0598bd50c0cf

    year = int(request.args.get("year"))
    state = request.args.get("state")
    county = request.args.get("county")

    bar_collection = db['predict_bar']
    state_code = state_mapping[state]
    county_code = county_mapping[county]

    for i in city_detail[county]:
        ddf.loc[len(ddf.index)] = [state_code, county_code, year, city_mapping[i]]

    for index, row in ddf.iterrows():
        # print({"state_code":row["state_code"],"county_code":row["county_code"], "city_num":row["city_num"], "year":row["year"]})
        result = bar_collection.find_one(
            {"state_code": int(row["state_code"]), "county_code": int(row["county_code"]), "city_num": int(row["city_num"]),
             "year": int(row["year"])})
        fo.append(round(result["carbonscore"], 3))

    return jsonify({"x": city_detail[county], "y": fo})


@app.route("/predict_CO_table")
def get_table_CO_score():
    ddict = {'state_code': [],
             'county_code': [],
             'year': []
             }

    fo = []
    ddf = pd.DataFrame(ddict)
    ddf["state_code"] = ddf["state_code"].astype(int)
    ddf["county_code"] = ddf["county_code"].astype(int)
    ddf["year"] = ddf["year"].astype(int)

    year = int(request.args.get("year"))
    state = request.args.get("state")
    # county = request.args.get("county")

    table_collection = db['predict_table']
    state_code = state_mapping[state]
    # county_code = county_mapping[county]

    for i in county_names_dict[state]:
        ddf.loc[len(ddf.index)] = [state_code, county_mapping[i], year]

    for index, row in ddf.iterrows():
        # print({"state_code":row["state_code"],"county_code":row["county_code"], "year":row["year"]})
        result = table_collection.find_one(
            {"state_code": int(row["state_code"]), "county_code": int(row["county_code"]), "year": int(row["year"])})
        fo.append(round(result["carbonscore"], 3))

    return jsonify({"county": county_names_dict[state], "carbonscore": fo})



if __name__ == '__main__':
    #connectToMongoCollection()
    # init_states()
    # init_counties()
    # app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #ddf = init_full_data()
    #model_cs, scaler = get_model(ddf)
    app.run(host="0.0.0.0")
    #app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))