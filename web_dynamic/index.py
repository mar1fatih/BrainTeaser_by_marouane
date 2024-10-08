#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template, abort, redirect, url_for, request, make_response
from datetime import datetime
import requests
import base64


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
    email = request.form.get('email') 
    password = request.form.get('password')
    emailPass = email + ':' + password
    bytlog = emailPass.encode('utf-8')
    encodedbyt = base64.b64encode(bytlog)
    encoded = encodedbyt.decode('utf-8')
    
    url = 'http://localhost:5000/connect'
    header = {'Authorization': 'Basic ' + encoded}

    res = requests.get(url, headers=header)

    if res.status_code == 200:
        token = res.json()['token']
        resp = make_response(redirect(url_for('quiz')))
        resp.set_cookie('X-Token', token, httponly=True, secure=True)
        return resp
    return redirect(url_for('home'))

@app.route('/quiz/', methods=['GET'], strict_slashes=False)
def quiz():
    """main quiz page"""
    token = request.cookies.get('X-Token')
    url = 'http://localhost:5000/users/me'
    header = {'X-Token': token}
    res = requests.get(url, headers=header)
    if res.status_code == 200:
        username = res.json()['username']
        highScore = res.json()['highScore']
        rendered_page = render_template('quiz.html',
                                        username=username,
                                        highScore=highScore)
        resp = make_response(rendered_page)
        resp.set_cookie('X-Token', token, httponly=True, secure=True)
        return resp

    return redirect(url_for('home'))

@app.route('/results/<string:username>', methods=['GET'], strict_slashes=False)
def quiz_results(username):
    """final results"""
    return render_template('results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003', debug=True)
