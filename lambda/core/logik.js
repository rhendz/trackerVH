var request = require('request');
const config = require('../config.js');

function refresh_goal(){
    //get total calorie goal!
    request.get(
        config.HOST_URL,
        function(error, response, body){
            if(!error && response.statusCode == 200){
                calorie_goal = 2000;
            }
        }
    )
}

function DB_PostData(){
    //post away to backend
    request.post(
        config.HOST_URL,
        { json: 
            { 
                "creation" : creation,
                "food" : '\"' + food +'\"',
                "size" : '\"' + size +'\"', 
                "amount" : parseFloat(amount),
                "timing" : '\"' + timing +'\"', 
            } 
        },
        
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("POSTED");
            }
            else{
                console.log("error!");
                console.log("status code: "+ response.statusCode);
            }
        }
    );
}