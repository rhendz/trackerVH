const config = require('../config.js');
var request = require('request');

module.exports = {
    return_food_data:function(item, app_id, app_key, callback){
        var URL_COMPLETE = config.ED_URL + 'ingr=' + item + '&app_id=' + app_id + '&app_key=' + app_key; 
        request(URL_COMPLETE, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            return callback(body);
        });
    },

    convert_food_data:function(data, measurement){
        fdata = data['parsed'][0]['food']['nutrients'];
        if(measurement == "tablespoon" || measurement == "tablespoons"){
            fdata['ENERC_KCAL'] /= 16;
        }
        else if(measurement == "teaspoon" || measurement == "teaspoons"){
            fdata['ENERC_KCAL'] /= 48;
        }
        else if(measurement == "cup" || measurement == "cups"){
            console.log("already in cups...");
        }
        else{
            console.log("doing nothing...");
        }
        return fdata;
    }
}