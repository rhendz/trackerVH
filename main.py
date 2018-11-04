import os
import io
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        f = request.get_json()
        print(f)
        return f
    else:
        return render_template('index.html')
