import os
import io
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        f = request.files['the_file']
        f = open(f, 'r')
        print(f.read())
    else:
        return render_template('index.html')
