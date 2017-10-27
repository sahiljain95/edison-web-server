var express = require('express');
var dateFormat = require('dateformat');
var sendMessage = require('../public/javascripts/message');
var credentials = require('../public/javascripts/token');
var utility = require('../public/javascripts/helper');
var router = express.Router();

var jsonResponse = {
  tempValue: 0,
  proximityValue: 0,
  soundValue: 0,
  timeStamp: dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
  tempState: 'SAFE',
  proximityState: 'SAFE',
  soundState: 'SAFE'
};

router.get('/:sensor', function(req, res, next) {
//  res.json(req.params);
  var param = req.params.sensor;
  console.log("Param type: " + param);
  //res.send(param);
  var tempValues = function(temp) {
  //  var temp = utility.getTemperature();
    jsonResponse.tempValue = temp.toFixed(2);
    jsonResponse.timeStamp = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
    if(temp <= 15 || temp > 45){
      jsonResponse.tempState = 'CRITICAL';
      //sendMessage(credentials.number, credentials.tempString);
    }
    else if((temp > 15 && temp < 20) || (temp > 35 && temp <= 45))
      jsonResponse.tempState = 'WARNING';
    else
       jsonResponse.tempState = 'SAFE';


  };

  var proxValues = function(proxValue) {
//    var proxValue = utility.getProximity();
    jsonResponse.proximityValue = proxValue.toFixed(2);
    jsonResponse.timeStamp = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
    if(proxValue >= 0.5){

    //  sendMessage(credentials.number, credentials.proximityString);
      jsonResponse.proximityState = 'UNSAFE';
    }
    else
      jsonResponse.proximityState = 'SAFE';


  };

  var soundValues = function(soundVal) {

    jsonResponse.soundValue = soundVal.toFixed(2);
    jsonResponse.timeStamp = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
    if(soundVal >= 1){

  //    sendMessage(credentials.number, credentials.proximityString);
      jsonResponse.soundState = 'UNSAFE';
    }
    else if(soundVal > 0.3 && soundVal < 1)
      jsonResponse.soundState = 'WARNING';
    else
      jsonResponse.soundState = 'SAFE';

  };

  var aggValues = function(){

    var aggProx = utility.getAggregatedProximity();
    var aggTemp = utility.getAggregatedTemperature();
    var aggSound = utility.getAggregatedSound();
    soundValues(aggSound);
    tempValues(aggTemp);
    proxValues(aggProx);
    utility.resetValues();

  };

  if(param === 'temperature'){

    var temp = utility.getTemperature();
    tempValues();
    console.log('Temperature JSON ', jsonResponse);
    res.send(jsonResponse);
  }

  else if(param === 'proximity'){

    var prox = utility.getProximity();
    proxValues(prox);
    console.log('Proximity JSON ', jsonResponse);
    res.send(jsonResponse);
  }

  else if(param === 'sound'){
      var sound = utility.getSound();
      soundValues(sound);
      console.log('Sound JSON', jsonResponse);
      res.send(jsonResponse);
  }

  else if(param === 'update'){
    aggValues();
    console.log('Approx JSON ', jsonResponse);
    res.send(jsonResponse);
  }
  else if(param === 'message'){
    console.log(req.body);
    var message = req.body.message;
    var phone = req.body.phone;
    console.log('Server received '+ message + ' ' +phone);
    //res.send(sendMessage(phone, message));
    var promise = sendMessage(phone, message);
    res.send(promise);
  }

});

router.post('/:sensor/:phone/:message', function(req, res, next) {
  var message = req.params.message;
  var phone = req.params.phone;
  console.log('Server received '+ message + ' ' +phone);
  //res.send(sendMessage(phone, message));
  var promise = sendMessage(phone, message);
  res.send(promise);
});


module.exports = router;
