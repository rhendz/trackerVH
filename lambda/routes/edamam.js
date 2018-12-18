const config = require('../config.js');

module.exports = {
    return_food_data: function(){
        var json_data;
        request.get(
            config.ED_URL,
            function(error, response, body){
                if(!error && response.statusCode == 200){
                    json_data = JSON.parse(body);
                }
            }
        )
        return json_data;
    }
}