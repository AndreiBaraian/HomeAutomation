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

var http = require('http');

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function getWelcomeResponse(callback) {
    
    const sessionAttributes = {};
    const cardTitle = 'Welcome to AutoHome';
    const speechOutput = 'Welcome to Andrei Baraian home automation project. ';

    const repromptText = 'Please tell me something ';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function createTemperatureAttributes(temperature) {
    return {
        temperature: temperature
    };
}

function sendTemperature(intent, session, callback) {
    
    const cardTitle = 'Temperature';
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
    var body = '';
    
    
    var httpPromise = new Promise( function(resolve,reject){
		http.get({
			host: '-.-.-.-',
			path: '/temperature',
			port: '----'
		}, function(response) {
			// Continuously update stream with data
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				// Data reception is done, do whatever with it!
				console.log(body);
				resolve('Done Sending');
			});
		});
	});
	httpPromise.then(
		function(data) {
			var info = JSON.parse(body);
			console.log('Function called succesfully:', data);
			sessionAttributes = createTemperatureAttributes(info.temperature);
			speechOutput = "Temperature is " + info.temperature;// + " degree Celsius. Humidity is " + info.humidity + " percent";
			repromptText = "Temperature is " + info.temperature;// + " degree Celsius. Humidity is " + info.humidity + " percent";
			console.log(speechOutput);
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		},
		function(err) {
			console.log('An error occurred:', err);
		}
	);
}


function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);
    
    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    
    if(intentName == 'TemperatureIntent') {
        sendTemperature(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for the demo. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

exports.handler = (event, context, callback) => {
    try{
        console.log(`event.session.applicationId=${event.session.application.applicationId}`);
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }
        
        if(event.request.type == 'LaunchRequest') {
            onLaunch(event.request,
            event.session,
            (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
        } else if(event.request.type == 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        }
    } catch(err) {
        callback(err);
    }
}