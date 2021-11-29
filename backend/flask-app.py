from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from pymongo import MongoClient
import argparse

app = Flask(__name__)
CORS(app)
state_names = []
county_names = []
offset_interval = 80000
row_count = 8614411

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

if __name__ == '__main__':
    connectToMongoCollection()
    init_states()
    init_counties()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))