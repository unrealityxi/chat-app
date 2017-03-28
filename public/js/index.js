var socket = io();
  
socket.on("connect", function(){
  console.log("Connected to server");

});

// DC handler
socket.on("disconnect", function(){
  console.log("Disconnected from server.");
});

// New message handler
socket.on("newMessage", function(message){
  console.log("New message");
  console.log(message);
});