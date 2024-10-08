#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template, abort
from datetime import datetime
import requests


app = Flask(__name__)

@app.route('/', strict_slashes=False)
def home():
    """ main page """ 
    leaders = requests.get('http://localhost:5000/leaders')
    if leaders.status_code == 200:
        print(leaders.json()['leaders'])
        return render_template('index.html', leaders=leaders.json()['leaders'])
    return render_template('index.html', leaders={})

@app.route('/users/<string:username>', methods=['GET'], strict_slashes=False)
def quiz(username):
    """main quiz page"""
    return render_template('quiz.html')

@app.route('/results/<string:username>', methods=['GET'], strict_slashes=False)
def quiz_results(username):
    """final results"""
    return render_template('results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003', debug=True)
