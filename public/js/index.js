var socket = io();
  
socket.on("connect", function(){
  console.log("Connected to server");


  socket.emit("createMessage", {
    "from": "dragan",
    "text": "Dobro jutro džezeri"
  });
});

// DC handler
socket.on("disconnect", function(){
  console.log("Disconnected from server.");
});

// New message handler
socket.on("newMessage", function(message){
  console.log(message);
});