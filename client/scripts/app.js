
// var message = {
//   username: 'username',
//   text: 'Hello World!!!',
//   roomname: 'hrr22 4life'
// };

var app = {};

app.init = function() {};
app.send = function(message)  {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

$(document).ready(function() {
  $( ".btn" ).click(function(event) {
    var visitorMessage = $( ".entry" ).val();
    console.log(visitorMessage);
    var user = window.location.href.split('username=')[1];
    var message = {};
    message.username = user;
    message.text = visitorMessage;
    message.roomname = 'test';
    app.send(message);
  });
});
