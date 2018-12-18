const config = require('../config.js');

function return_food_data(){
    var json_data = {};
    request.get(
        config.ED_URL,
        function(error, response, body){
            if(!error && response.statusCode == 200){
                
            }
        }
    )
    return json_data;
}