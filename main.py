import urllib.request
import json
from flask import Flask, render_template, request
from google.cloud import datastore

APP_ID = '5cf1fbde'
API_KEY = 'a1e424815db07a8297e670403ca00a9e'

app = Flask(__name__)


def create_client(project_id):
    return datastore.Client(project_id)


def add_task(client, fdata):
    key = client.key(fdata['dateTime'])

    task = datastore.Entity(
        key, exclude_from_indexes=['dateTime'])

    task.update(fdata)

    client.put(task)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        client = create_client('tracker-221417')
        f = request.get_json()

        EDA_REQUEST = 'https://api.edamam.com/api/food-database/parser' + '?app_id=' + APP_ID + '&app_key=' + API_KEY + '&ingr=' + f['food']

        eda_data = json.loads(urllib.request.urlopen(EDA_REQUEST).read().decode('utf-8'))

        fdata = {
            'dateTime': f['creation'],
            'food': f['food'],
            'size': f['size'],
            'amount': f['amount'],
            'timing': f['timing'],
            'nutrients': eda_data['parsed'][0]['food']['nutrients']
        }

        if (fdata['size'] == 'tablespoon' or fdata['size'] == 'tablespoons'):
            fdata['nutrients'] = [x * (7.05 * fdata['amount']) for x in fdata['nutrients']]
        elif (fdata['size'] == 'teaspoon' or fdata['size'] == 'teaspoons'):
            fdata['nutrients'] = [x * (20 * fdata['amount']) for x in fdata['nutrients']]
        else:
            fdata['nutrients'] = [x * (0.5 * fdata['amount']) for x in fdata['nutrients']]

        print(fdata)
        add_task(client, fdata['dateTime'], fdata)

    return render_template('index.html')
