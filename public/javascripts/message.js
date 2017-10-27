
// Do the following for your own credentials file!
/*
var credentials = {
  id: 'YOUR ID',
  token: 'YOUR TOKEN GOES HERE'
};

module.exports = credentials;
*/

var credentials = require('./token.js');
var exotel = require('exotel')({
    id: credentials.id,
    token: credentials.token
});

var sendMessage = function(number, message) {

    exotel.sendSMS(String(number), message, function(err, result){
          if(!err){
            console.log(result);
            return "Message sent successfully";
          }
          else {
            return "Failed! Try again!";
          }
    });
}

module.exports = sendMessage;
