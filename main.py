import urllib.request
import json
from flask import Flask, render_template, request

APP_ID = '5cf1fbde'
API_KEY = 'a1e424815db07a8297e670403ca00a9e'

app = Flask(__name__)


# def create_client(project_id):
#     return datastore.Client(project_id)
#
#
# def add_task(client, fdata):
#     key = client.key(fdata['dateTime'])
#
#     task = datastore.Entity(
#         key, exclude_from_indexes=['dateTime'])
#
#     task.update(fdata)
#
#     client.put(task)


@app.route('/', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        # client = create_client('tracker-221417')
        f = request.get_json()

        print(f['food'][1])
        EDA_REQUEST = 'https://api.edamam.com/api/food-database/parser' + '?app_id=' + APP_ID + '&app_key=' + API_KEY + '&ingr=' + f['food'][1]

        eda_data = json.loads(urllib.request.urlopen(EDA_REQUEST).read().decode('utf-8'))

        fdata = {
            'dateTime': f['creation'],
            'food': f['food'],
            'size': f['size'],
            'amount': f['amount'],
            'timing': f['timing'],
            'nutrients': eda_data['parsed'][0]['food']['nutrients']
        }

        print(fdata)

        if (fdata['size'] == 'tablespoon' or fdata['size'] == 'tablespoons'):
            fdata['nutrients']['ENERC_KCAL'] *= 7.05 * fdata['amount']
            fdata['nutrients']['PROCNT'] *= 7.05 * fdata['amount']
            fdata['nutrients']['FAT'] *= 7.05 * fdata['amount']
            fdata['nutrients']['CHOCDF'] *= 7.05 * fdata['amount']
        elif (fdata['size'] == 'teaspoon' or fdata['size'] == 'teaspoons'):
            fdata['nutrients']['ENERC_KCAL'] *= 20 * fdata['amount']
            fdata['nutrients']['PROCNT'] *= 20 * fdata['amount']
            fdata['nutrients']['FAT'] *= 20 * fdata['amount']
            fdata['nutrients']['CHOCDF'] *= 20 * fdata['amount']
        else:
            fdata['nutrients']['ENERC_KCAL'] *= 0.5 * fdata['amount']
            fdata['nutrients']['PROCNT'] *= 0.5 * fdata['amount']
            fdata['nutrients']['FAT'] *= 0.5 * fdata['amount']
            fdata['nutrients']['CHOCDF'] *= 0.5 * fdata['amount']

        print(fdata)
        # add_task(client, fdata['dateTime'], fdata)

    return render_template('index.html')
