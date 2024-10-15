#!/usr/bin/python3
""" Starts a Flash Web Application """
import requests
import base64
from datetime import datetime
from flask import Flask, render_template, abort
from flask import redirect, url_for, request, make_response, jsonify


app = Flask(__name__)


@app.route('/', strict_slashes=False)
def home():
    """ main page """
    leaders = requests.get('http://localhost:5000/leaders')
    if leaders.status_code == 200:
        return render_template('index.html', leaders=leaders.json()['leaders'])
    return render_template('index.html', leaders={})


@app.route('/create-account', strict_slashes=False)
def create_account():
    """ create account page"""
    leaders = requests.get('http://localhost:5000/leaders')
    if leaders.status_code == 200:
        return render_template('create.html',
                               leaders=leaders.json()['leaders'])
    return render_template('create.html', leaders={})


@app.route('/login', methods=['POST'], strict_slashes=False)
def login():
    """verify login"""
    err = 'The email or password is incorrect'
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
        resp.set_cookie('X-Token', token, secure=True, samesite='None')
        return resp
    leaders = requests.get('http://localhost:5000/leaders')
    if leaders.status_code == 200:
        return render_template('index.html',
                               leaders=leaders.json()['leaders'], err=err)
    return render_template('index.html', leaders={}, err=err)


@app.route('/create', methods=['POST'], strict_slashes=False)
def create():
    """create new account"""
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    url = 'http://localhost:5000/users'
    header = {'Content-Type': 'application/json'}
    body = {
            'username': username,
            'email': email,
            'password': password
            }
    res = requests.post(url, headers=header, json=body)
    if res.status_code == 201:
        resp = make_response(redirect(url_for('home')))
        resp.set_cookie('create', 'created successfully')
        return resp
    resp = make_response(redirect(url_for('home')))
    return resp


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
        resp.set_cookie('X-Token', token)
        return resp
    return redirect(url_for('home'))


@app.route('/results', methods=['POST'], strict_slashes=False)
def quiz_results():
    """final results"""
    token = request.cookies.get('X-Token')
    score = request.get_json()
    url = 'http://localhost:5000/players'

    if not token or not score:
        abort(400)

    header = {
                'Content-Type': 'application/json',
                'X-Token': token
                }

    res = requests.post(url, headers=header, json=score)
    if res.status_code == 201:
        highScore = res.json()['highScore']
        resp = {"highScore": "new {}".format(highScore)}
        return jsonify(resp)
    if res.status_code == 200:
        highScore = res.json()['highScore']
        resp = {"highScore": "still {}".format(highScore)}
        return jsonify(resp)
    abort(400)


@app.route('/disconnect', methods=['GET'], strict_slashes=False)
def final_result():
    """final results"""
    token = request.headers.get('X-Token')
    header = {'X-Token': token}
    res = requests.post('http://localhost:5000/disconnect', headers=header)
    if res.status_code == 200:
        return "Success!", 200
    else:
        return "Failed!", 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003', debug=True)
