var AWS = require('aws-sdk');
var request = require('request');
const config = require('../config.js');

module.exports = {
    DB_PostData: function(foodData, default_calorie_goal) {
        // Get connection to dynamo db
        var ddb = new AWS.DynamoDB.DocumentClient();

        // Adds a new user if not in Users
        var userDataParams = {
          TableName : 'Users',
          Key : {
            "userId" : foodData.userId
          }
        };

        ddb.get(userDataParams, function(err, data) {
          if (data.Item == null) { // Unable to find userId in Users
            userDataParams = {
              TableName : "Users",
              Item : {
                "userId" : foodData.userId,
                "dailyCalorieGoal" : default_calorie_goal
              }
            };

            // Add the new user
            ddb.put(userDataParams, function(err, data) {
              if (err) console.log("userData: " + err, err.stack); // an error occurred
            });
          }
        });

        // Post to DynamoDB
        var foodDataParams = {
          TableName : "FoodRecords",
          Item : foodData,
        };

        ddb.put(foodDataParams, function(err, data) {
          if (err) console.log("foodData: " + err, err.stack); // an error occurred
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
