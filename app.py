import os

import pandas as pd
import numpy as np



from flask import Flask, jsonify, render_template,request,url_for,redirect, make_response
from bson.json_util import dumps
import pymongo
import json
from functools import wraps

app = Flask(__name__)

# conn = 'mongodb://localhost:27017'
# client = pymongo.MongoClient(conn)
# db = client.Project2_data
# collection = db.GEOJSON
# results = db.GEOJSON.find_one()
# c={}
# c.update({"type":results["type"],"features":results["features"]})

#################################################
# Database Setup
#################################################
def auth_required(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		auth= request.authorization
		if auth and auth.username =="admin" and auth.password== 'admin':
			return f(*args,**kwargs)

		return make_response('Access Denied',401, {'WWW-Authenticate':'Basic realm="Login Required'})
	return decorated


@app.route("/")
def index():
	
    """Return the homepage."""
    return render_template("index.html")

@app.route("/data8481115")
def cho():
  	with open('db/resultnew.json') as json_file:  
   		c = json.load(json_file)
   		return jsonify(c)



@app.route("/data")
@auth_required
def data():
  	with open('db/resultnew.json') as json_file:  
   		c = json.load(json_file)
   		return jsonify(c)


@app.route("/choropleth")
def choro():
    print("received request from 'ChoroplethMap page'")
    return render_template("choropleth.html")

@app.route("/plotlydata")
def plotly_data():
	df=pd.read_csv("db/QII_GDP_Year.csv")
	df=df.dropna()
	df = df.drop(df.columns[[0]], axis=1)
	result = df.to_dict(orient='records')
	return jsonify(result)


@app.route("/plotly")
def plotly1():
	return render_template("plotly.html")


@app.route("/barracechart")
def barrace():
	return render_template("barRaceChart.html")

@app.route("/names")
def names():
	df=pd.read_csv("db/dropna.csv")
	df = df.drop(df.columns[[0]], axis=1)
	return jsonify(list(df["Country"]))

@app.route("/metadata/<countryname>")
def country(countryname):
	df=pd.read_csv("db/dropna.csv")
	df = df.drop(df.columns[[0]], axis=1)
	result = df.loc[df["Country"]==countryname]
	countrydata=result.to_dict("record")[0]
	return jsonify(countrydata)

@app.route("/chart")
def build():
	return render_template("chart.html")

@app.route("/GDPRaceChart")
def build1():
	return render_template("GDPRaceChart.html")


@app.route("/CombineRaceChart")
def build2():
	return render_template("CombineRaceChart.html")
@app.route("/QLIRaceChart")
def build3():
	return render_template("QLIRaceChart.html")

	




# @app.route('/login', methods=['GET','POST'])
# def login():
# 	error= None
# 	if request.method=='POST':
# 		if request.form['username'] != 'admin' or request.form['password'] !='admin':
# 			error = 'Access Denied. Please try again.'
# 		else:
# 			return redirect(url_for('data'))
# 	return render_template('login.html',error=error)

if __name__ == "__main__":
    app.run(debug=True)
