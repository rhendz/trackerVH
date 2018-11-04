import urllib.request
from flask import Flask, render_template, request

DEMO_KEY = 'oTJswtPWakxiFh3ov4XalmvKB7a5555wPxqPQeSW'

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        f = request.get_json()

        URL_USDA_REQUEST = 'https://api.nal.usda.gov/ndb/list?format=json&lt=',
        + f['food'] + '&sort=1&api_key=' + DEMO_KEY

        usda_data = urllib.request.urlopen(URL_USDA_REQUEST).read()

        print(f)
        print(usda_data)
    return render_template('index.html')
