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
var request = require('request');
const config = require('./config.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = config.APP_ID;
var calorie_goal = 2000;
const HELP_MESSAGE = '<break time="0.1s"/>! You can give me commands such as <break time="0.2s"/>: "add three cups of butter" or <break time="0.1s"/> "what\'s my total calories?" Try it!';
//const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

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

//=========================================================================================================================================
//Event handlers below. (EnterFoodNormal main event)
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        refresh_goal();
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

        //get the calculated calories
        var entry_calories = 1614;

        request.get(
            config.HOST_URL,
            function(error, response, body){
                if(!error && response.statusCode == 200){
                    console.log("GOT");
                }
                else{
                    console.log("error!");
                    console.log("status code: "+response.statusCode);
                }
            }
        )

        //conditional responses to the calculated calories
        //500 calorie warning
        var def_res = "Ok, I've added " + amount + " " + size + " " + food + " " + "and totaled at " + entry_calories + " calories";
        
        if(entry_calories >= calorie_goal-500){
            console.log("500 warning reached!");
            this.response.speak(def_res +'<break time="0.5s"/> By the way, you are 500 or less calories away from your total daily calorie goal.');
        }
        else if(entry_calories == calorie_goal){
            console.log("equal warning reached!");
            this.response.speak(def_res + '<break time="0.5s"/> By the way, you have have hit your total daily calorie goal!');
        }
        else if(entry_calories > calorie_goal){
            console.log("over goal warning reached!");
            this.response.speak(def_res + '<break time="0.5s"/> By the way, you have exceed your total daily calorie goal by ' + (entry_calories-calorie_goal) + ' calories!');
        }
        else{
            //post that shit
            this.response.speak(def_res);
        }
        this.emit(':responseReady');
    },
    'GetDailyBalance': function () {
        //refresh_goal();
        //get request here to get total daily calories
        var calories_daily = 100;
        this.response.speak("Your total calories consumed today is " + calories_daily);
        this.emit(':responseReady');
    },
    'DeleteLast' : function () {
        this.response.speak("Ok, deleting your latest food entry...");
        //delete latest one
        request.post(
            'http://httpbin.org/post',
            { json: { key: 'value' } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    this.request.speak("Successfully deleted food entry");
                }
                else{
                    this.request.speak("Uh oh! Something went wrong! Check your connection.");
                }
            }
        );

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
