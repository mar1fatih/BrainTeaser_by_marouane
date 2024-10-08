#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template, abort, redirect, url_for
from datetime import datetime
import requests


app = Flask(__name__)

@app.route('/', strict_slashes=False)
def home():
    """ main page """ 
    leaders = requests.get('http://localhost:5000/leaders')
    if leaders.status_code == 200:
        return render_template('index.html', leaders=leaders.json()['leaders'])
    return render_template('index.html', leaders={})

@app.route('/login', methods=['POST'],strict_slashes=False)
def login():
    """verify login"""
    print('hello world')
    email = request.form.get('email')  # Accessing email
    password = request.form.get('password')  # Accessing password
    
    # Process the data (e.g., validate, store, etc.)
    # For demonstration, we'll just print the values
    print(f'Email: {email}, Password: {password}')
    return redirect(url_for('/'))

@app.route('/users/', methods=['GET'], strict_slashes=False)
def quiz():
    """main quiz page"""
    return render_template('quiz.html')

@app.route('/results/<string:username>', methods=['GET'], strict_slashes=False)
def quiz_results(username):
    """final results"""
    return render_template('results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003', debug=True)
