var app = {};

app.init = function() {
  app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';
  app.room = 'lobby';
  app.rooms = ['lobby'];
  app.fetch();
  app.friends = [];
  app.user = window.location.href.split('username=')[1];
};

app.send = function(message)  {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      $('.entry').val('');
      app.clearMessages();
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    data: { order: '-createdAt' },
    contentType: 'application/json',
    //headers: {"Content-Security-Policy": 'default-src "none"; script-src "self"; connect-src "self"; img-src "self"; style-src "self"'},

    success: function(messages) {
      console.log('messages came in');
      var messages = messages.results;
      messages.forEach(function(message) {
        app.renderMessage(message);
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

app.handleSubmit = function (event) {
  var message = {};
  message.username = app.user;
  message.text = $( ".entry" ).val();
  message.roomname = app.room;
  app.send(message);
  event.preventDefault();
};

$(document).ready(function() {
  $( "#send" ).submit(function(event) {
    var visitorMessage = $( ".entry" ).val();
    console.log(visitorMessage);
    app.handleSubmit(event);
  });

  $( ".clear" ).click(function(event) {
    app.clearMessages();
  });

  $("body").on("click",".username",function(event) {
    var user = this.innerHTML;
    console.log('user: ', user);
    app.handleUsernameClick(user);
  });

  $("#roomSelect").change(function(event) {
    if(this.value === 'add-room') {
      var roomAdd = prompt('What is your room name?');
      app.renderRoom(roomAdd);
    } else {
      app.clearMessages();
      app.room = this.value;
      app.fetch();
    }
  });
});

app.handleUsernameClick = function(user) {
  app.friends.push(user);
  app.clearMessages();
  app.fetch();
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  if (app.rooms.indexOf(message.roomname) === -1 && message.roomname) {
    app.rooms.push(message.roomname);
    var newRoomMod = message.roomname.replace(' ', '-');
    $("#roomSelect").prepend($('<option value="' + newRoomMod + '">' + message.roomname + '</option>'));
  }


  if(app.room === message.roomname) {
    var messageContainer = $('<div class="chat"></div>');
    messageContainer.append('<a class="username">' + message.username + '</a>');
    var escaped = app.escapeHtml(message.text);

    if(app.friends.indexOf(message.username) !== -1) {
      messageContainer.append('<div class="message-bold">' + escaped + '</div');
    } else {
      messageContainer.append('<div class="message-text">' + escaped + '</div');
    }

    $('#chats').append(messageContainer);
  }
};

app.renderRoom = function(roomName) {
  if(roomName) {
    var newRoomMod = roomName.replace(' ', '-');
    $("#roomSelect").prepend($('<option value="' + newRoomMod + '">' + roomName + '</option>'));
    $("#roomSelect").val(newRoomMod);
    app.room = newRoomMod;
    app.clearMessages();
    app.fetch();
  }
};

app.escapeHtml = function (str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// UNSAFE with unsafe strings; only use on previously-escaped ones!
app.unescapeHtml = function (escapedStr) {
  var div = document.createElement('div');
  div.innerHTML = escapedStr;
  var child = div.childNodes[0];
  return child ? child.nodeValue : '';
};

app.escapeMsg = function(txt) {
  return app.unescapeHtml(app.escapeHtml(txt));
};

app.init();

//app.fetch();
