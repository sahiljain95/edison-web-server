/* This is the file which reads in all the sensor data.

1) It has methods which can return sensor reading at any time.
2) Every 5 mins, the average reading of the sensor is sent and UI is updated.

*/

var express = require('express');
var dht-sensor = require('dht-sensor');
var credentials = require('./token.js');
var mraa = require('mraa'); //require mraa

console.log('MRAA Version: ' + mraa.getVersion());

var tempPin = new mraa.Aio(0); //setup access analog input Analog pin #0 for temperature sensing!
var buzzerPin = new mraa.Gpio(12);
var proximity = new mraa.Gpio(2);
var soundPin = new mraa.Aio(X);
var stepCount = 0, avgTemp = 0, avgSound = 0, avgProximity = 0;     // Measured as 0,1!

var utility = {

  getTemperature: function(){
    // var analogValue = tempPin.read() * 0.004882814;
    // return ((analogValue - 0.5) * 100);
    var dhtValue = dht-sensor.read(11,2);
    var tempVal = dhtValue.temperature;

    console.log('Temp Value ', tempVal);
    return tempVal;
    return Math.floor((Math.random() * 20) + 10);
  },

  getProximity: function() {
    // var proximityValue = proximity.read();
    // if(proximityValue === 1)
    //    buzzerPin.write(1);
      // else
      //   buzzerPin.write(0);
    // return proximityValue;

   return Math.floor((Math.random() * 100))%2;
  },

  getSound : function() {
      // Read about sound detection sensor and implement!
    return Math.floor((Math.random() * 2));

  },

  getAggregatedSound: function() {
    return avgSound/stepCount;
  },

  getAggregatedProximity: function() {
    return avgProximity/stepCount;
  },

  getAggregatedTemperature: function() {
    return avgTemp/stepCount;
  },

  setAggregatedSound: function() {
    avgSound = avgSound + utility.getSound();
  },

  setAggregatedTemperature: function () {
    avgTemp = avgTemp + utility.getTemperature();
  },

  setAggregatedProximity: function() {
    avgProximity = avgProximity + utility.getProximity();
    stepCount = stepCount + 1;
  },

  resetValues: function() {
    avgProximity = avgTemp = avgSound = stepCount = 0;
  }

}

setInterval(utility.setAggregatedTemperature,2000);
setInterval(utility.setAggregatedProximity,2000);
setInterval(utility.setAggregatedSound,2000);

module.exports = utility;
