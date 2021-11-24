from flask import Flask, jsonify
import os
from pymongo import MongoClient
import argparse

app = Flask(__name__)
# TODO store state names and county names in memory?
state_names = []
county_names = []
offset_interval = 80000
row_count = 8614411

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

if __name__ == '__main__':
    connectToMongoCollection()
    init_states()
    init_counties()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #test_state_insert()
    #test_county_insert()