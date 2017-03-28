const path = require("path");
const http = require("http");
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketIO = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


// This is momma and pappa, eq. of expresses app.get()
// Its an event handler.
// Arg "socket" stands for client.
// On connect, alerts us
io.on("connection", (socket)=>{
  console.log("New user connected!");

  // Emits new message to the client
  socket.emit("newMessage", {
    "from": "Jainine",
    "text": "Hi there and welcome!",
    "createdAt": 12345
  });

  // DC handler
  socket.on("disconnect", ()=>{
    console.log("Client disconnected");
  });
  
  // Receives created msg from the client
  socket.on("createMessage", (message) => {
    console.log(message);
  });
});


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



server.listen(PORT, console.log(`App listening on port ${PORT}`));