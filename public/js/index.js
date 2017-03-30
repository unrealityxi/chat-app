var socket = io();

// Just confirms that user connected. 
socket.on("connect", function(){
  console.log("Connected to server");
});

// DC handler
socket.on("disconnect", function(){
  console.log("Disconnected from server.");
});

// New message handler
socket.on("newMessage", function(message){
  // Makes new list element
  var li = jQuery("<li></li>");

  // get messages time
  var formattedTime = moment(message.createdAt).format("h:mm a");

  //sets messages text
  li.text(`${formattedTime} ${message.from}: ${message.text}`);

  // renders message to screen
  jQuery("#messages").append(li);
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