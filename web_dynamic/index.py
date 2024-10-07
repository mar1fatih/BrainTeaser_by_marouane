#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template, abort
from datetime import datetime
import requests


app = Flask(__name__)

@app.route('/', strict_slashes=False)
def home():
    """ main page """
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5003')
