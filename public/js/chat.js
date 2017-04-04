var socket = io();


function scrollToBottom(){
  // Selectors
  var messages = $("#messages");
  // Heights
  var newMessage = messages.children("li:last-child");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");

  var totalHeight = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;

  if (totalHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

// Just confirms that user connected. 
socket.on("connect", function(){

  // Fetches parameters from form query string
  var params = jQuery.deparam(window.location.search);

  // emits join event to the server
  // takes callback to redirect user back to starting screen
  // if any of params is invalid
  socket.emit("join", params, function(err){
    if (err) {
      alert(err);      
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

// DC handler
socket.on("disconnect", function(){
  console.log("Disconnected from server.");
});

// Updates user list

socket.on("updateUserList", function(users){
  var ol = $("<ol></ol>");

  users.forEach(function (user) {
    ol.append($("<li></li>").text(user));
  });

  $("#users").html(ol);

});

// New message handler
socket.on("newMessage", function(message){
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
     text: message.text,
     createdAt: formattedTime,
     from: message.from,
  });

  $("#messages").append(html);
  scrollToBottom();

});

// Location message handler
socket.on("newLocationMessage", function(message){
  var li = $("<li></li>");
  var a = $("<a target='_blank'></a>");

  // gets formatted time
  var formattedTime = moment(message.createdAt).format("h:mm a");

  // Renders clickable link
  li.text(`${formattedTime} ${message.from}: `);
  a.attr("href", message.url);
  a.text("My current location");
  li.append(a);
  $("#messages").append(li);
  scrollToBottom();
});


// Submit message handler
jQuery("#message-form").on("submit", function(e){
  e.preventDefault();
  // emits created message event

  var messageTextbox = $("[name=message]");

  var text = messageTextbox.val();
  if (!text){
    return;
  }

  socket.emit("createMessage",{
    from: "User",
    text: messageTextbox.val()
  }, function(){
    messageTextbox.val("");
  });
});

var locationButton = $("#send-location");

locationButton.on("click", function() {
  if (!navigator.geolocation){
    return alert("Geolocation not supported by your browser");
  }


  locationButton.attr("disabled", "disabled").text("Sharing location...");

  navigator.geolocation.getCurrentPosition(function(position){

    locationButton.removeAttr("disabled").text("Share location");
    socket.emit("createLocationMessage", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  }, function () {
    locationButton.removeAttr("disabled").text("Share location");
    alert("Unable to fetch location");
  });

});