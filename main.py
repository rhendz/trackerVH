import urllib.request
from flask import Flask, render_template, request

APP_ID = '5cf1fbde'
API_KEY = 'a1e424815db07a8297e670403ca00a9e'

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        f = request.get_json()
        print(f['food'])

        EDA_REQUEST = 'https://api.edamam.com/api/food-database/parser' + '&app_id=' + APP_ID + '&app_key=' + API_KEY + '&ingr=' + f['food']
        print(EDA_REQUEST)

        eda_data = urllib.request.urlopen(EDA_REQUEST).read()

        print(f)
        print(eda_data)
    return render_template('index.html')
