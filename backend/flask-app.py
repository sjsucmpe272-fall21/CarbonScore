from flask import Flask, jsonify, request
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

app = Flask(__name__)
# TODO store state names and county names in memory?
state_names = []
county_names = []
offset_interval = 80000
row_count = 8614411
model_cs = ""
filename = "gbr.pkl"
model_cs = pickle.load(open(filename, 'rb'))
print("Training Model Loaded")
scaler = MinMaxScaler()



def connectToMongoCollection():
    # mongo_client = MongoClient("mongodb://localhost:27017/")
    # mongodb://user:password@server:port/
    parser = argparse.ArgumentParser()
    #parser.add_argument('--ip', help='IP address of MongoDB server')
    parser.add_argument('--user', help='MongoDB server username', required=True)
    parser.add_argument('--pwd', help='MongoDB server password', required=True)
    #parser.add_argument('--port', help='MongoDB server port number')
    args = parser.parse_args()
    '''connect_uri = ""
    if args.user and args.pwd:
        connect_uri = "mongodb://" + args.user+":"+args.pwd+"@"+args.ip
    else:
        connect_uri = "mongodb://" + args.ip
    if args.port:
        connect_uri = connect_uri + ":"+args.port+"/"
    else:
        connect_uri = connect_uri + ":27017/"'''
    connect_uri = "mongodb+srv://" + args.user + ":" + args.pwd + "@cluster0.tqbki.mongodb.net/carbonScore?retryWrites=true&w=majority"
    mongo_client = MongoClient(connect_uri)
    global db
    db = mongo_client["carbonScore"]

def init_states():
    '''offset = 0
    names_list = []
    while offset < row_count:
        query_string = """SELECT DISTINCT state_name FROM `bigquery-public-data.epa_historical_air_quality.co_daily_summary`
            LIMIT 80000 OFFSET """ + str(offset)
        names = (bqclient.query(query_string).result().to_dataframe(create_bqstorage_client=True, ))
        names_list.append(names)
        offset += offset_interval

    df = pd.concat(names_list, ignore_index=True)
    names_ndarray = df['state_name'].unique()
    global state_names
    state_names = names_ndarray.tolist()'''
    states_collection = db["states"]
    result = list(states_collection.find())
    for item in result:
        state_names.append(item['state'])

def init_counties():
    # state = request.args.get('state')
    # enforces state query param to be passed
    # state = request.args['state']
    '''state = 'California'
    offset = 0
    names = []
    while offset < row_count:
        query_string = """SELECT DISTINCT county_name FROM `bigquery-public-data.epa_historical_air_quality.co_daily_summary`
            WHERE state_name='""" + state + """' LIMIT 80000 OFFSET """ + str(offset)
        names_df = (bqclient.query(query_string).result().to_dataframe(create_bqstorage_client=True, ))
        names.append(names_df)
        offset += offset_interval

    df = pd.concat(names, ignore_index=True)
    names_ndarray = df['county_name'].unique()
    global county_names
    county_names = names_ndarray.tolist()'''
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

def test_state_insert():
    df = ['hello-state','hg33','sahee']
    mongo_dict_list = []
    states_collection = db["states"]
    for item in df:
        temp_dict = {"state": item}
        mongo_dict_list.append(temp_dict)
    states_collection.insert_many(mongo_dict_list)

def test_county_insert():
    df = [['Peoria', 'Illinois'],
     ['McCracken', 'Kentucky'],
     ['Hampden', 'Massachusetts']]
    mongo_dict_list = []
    counties_collection = db['counties']
    for item in df:
        temp_dict = {"county": item[0], "state": item[1]}
        mongo_dict_list.append(temp_dict)
    counties_collection.insert_many(mongo_dict_list)

@app.route("/states")
def get_states():
    return jsonify(state_names)

@app.route("/counties")
def get_counties():
    return jsonify(county_names)

@app.route("/getscore")
def get_carbon_score():
    state = int(request.args.get("state_code"))
    county = int(request.args.get("county_code"))
    city = int(request.args.get("site_num"))
    date_l = request.args.get("date_local")
    #print(type(date_l))
    dd = datetime.datetime.strptime(date_l,"%Y-%m-%d")
    new_df = pd.DataFrame({"state_code":[state], "county_code":[county], "site_num":[city], "year":[dd.year], "month":[dd.month],"day":[dd.day]})
    scaled_val = scaler.fit_transform(new_df)
    #print(type(model_cs.predict(scaled_val)))
    return jsonify({"Carbon Score":str(model_cs.predict(scaled_val)[0])})
    

if __name__ == '__main__':
    connectToMongoCollection()
    init_states()
    init_counties()
    #ddf = init_full_data()
    #model_cs, scaler = get_model(ddf)
    #app.run(host="0.0.0.0")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #test_state_insert()
    #test_county_insert()