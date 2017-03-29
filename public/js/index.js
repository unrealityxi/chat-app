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
  //sets messages text
  li.text(`${message.from}: ${message.text}`);
  // renders message to screen
  jQuery("#messages").append(li);
});

// Location message handler
socket.on("newLocationMessage", function(message){
  var li = $("<li></li>");
  var a = $("<a target='_blank'></a>");


  // Renders clickable link
  li.text(`${message.from}: `);
  a.attr("href", message.url);
  a.text("My current location");
  li.append(a);
  $("#messages").append(li);
});


// Submit message handler
jQuery("#message-form").on("submit", function(e){
  e.preventDefault();
  // emits created message event
  socket.emit("createMessage",{
    from: "User",
    text: jQuery("[name=message]").val()
  }, function(){
  });
});

var locationButton = $("#send-location");

locationButton.on("click", function() {
  if (!navigator.geolocation){
    return alert("Geolocation not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(function(position){

    socket.emit("createLocationMessage", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  }, function () {
    alert("Unable to fetch location");
  });

});