/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const logik = require('./core/logik.js');
var request = require('request');
var edamam = require('./routes/edamam.js');
const config = require('./config.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = config.APP_ID;
var calorie_goal = 2000;
const HELP_MESSAGE = '<break time="0.1s"/>You can give me commands such as <break time="0.2s"/>: "add three cups of butter" or <break time="0.1s"/> "what\'s my total calories?" Try it!';
//const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//Event handlers below. (EnterFoodNormal main event)
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        logik.refresh_goal();
        this.emit('Entry');
    },
    'Entry': function () {
        this.response.speak("Hello! Welcome to Tracker! We help you track your calorie goals! To get a list of commands say: help").listen();
        this.emit(':responseReady');
    },
    'EnterFoodNormal': function() {
        var food = this.event.request.intent.slots.food.value;
        var size = this.event.request.intent.slots.size.value;
        var amount = this.event.request.intent.slots.amount.value;
        var timing = this.event.request.intent.slots.timing.value;
        
        if(isNaN(amount)){
            amount = '1';
        }
        
        if(size == 'undefined'){
            size = 'cup';
        }
    
        if(timing == "undefined"){
            //make timing right now if not specified
            timing = "unknown";
        }

        var creation = (new Date).getTime();

        var URL_COMPLETE = config.ED_URL + 'ingr=' + food + '&app_id=' + config.ED_APP_ID + '&app_key=' + config.ED_APP_KEY; 
        request(URL_COMPLETE, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            
            var fdata = edamam.convert_food_data(body, size);

            var calorie_count =  amount * fdata['ENERC_KCAL'];
            var def_res = "Ok, I've added " + amount + " " + size + " " + food + " " + "and totaled at " + calorie_count + " calories";
        
            if(calorie_count > calorie_goal){
                console.log("over goal warning reached!");
                this.response.speak(def_res + '<break time="0.5s"/> By the way, you have exceed your total daily calorie goal by ' + (calorie_count-calorie_goal) + ' calories!');
            }
            else if(calorie_count == calorie_goal){
                console.log("equal warning reached!");
                this.response.speak(def_res + '<break time="0.5s"/> By the way, you have have hit your total daily calorie goal!');
            }
            else if(calorie_count >= calorie_goal-500){
                console.log("500 warning reached!");
                this.response.speak(def_res +'<break time="0.5s"/> By the way, you are 500 or less calories away from your total daily calorie goal.');
            }
            else{
                //post that shit
                this.response.speak(def_res);
            }
            this.emit(':responseReady');
        });
    
        //db call
        //HERE
    },
    'GetDailyBalance': function () {
        //uncomment when DB code is established
        //refresh_goal();
        //get request here to get total daily calories
        //logik.DB_GetData();
        this.response.speak("Your total calories consumed today is " + calories_daily);
        this.emit(':responseReady');
    },
    'DeleteLast' : function () {
        this.response.speak("Ok, deleting your latest food entry...");
        //delete latest one
        //logik.DB_PostData();
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        //const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen();
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
