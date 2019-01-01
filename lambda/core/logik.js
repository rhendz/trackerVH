var AWS = require('aws-sdk');
var request = require('request');
const config = require('../config.js');

module.exports = {
    refresh_goal: function(){
        //get total calorie goal!
        request.get(
            config.HOST_URL,
            function(error, response, body){
                if(!error && response.statusCode == 200){
                    calorie_goal = 2000;
                }
            }
        )
    },

    DB_PostData: function(foodData) {
        // Get connection to dynamo db
        var ddb = new AWS.DynamoDB();

        // post away to backend
        var params = {
          TableName: 'FoodRecords',
          Item: foodData,
        };

        ddb.putItem(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
        });
    },

    DB_GetData: function() {
        URL = config.HOST_URL;
        request(URL, (err, res, body) => {
            if (err) { return console.log(err); }
            return callback(body);
        });
    }
};
