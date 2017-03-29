const path = require("path");
const http = require("http");
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketIO = require("socket.io");
const {generateMessage} = require("./utils/message.js");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


// This is momma and pappa, eq. of expresses app.get()
// Its an event handler.
// Arg "socket" stands for client.
// On connect, alerts us
io.on("connection", (socket)=>{
  console.log("New user connected!");

  socket.emit("newMessage", generateMessage("Admin", "Welcome to the chatroom"));

  socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined!"));



  // DC handler
  socket.on("disconnect", ()=>{
    console.log("Client disconnected");
  });
  
  // CREATEMESSAGE listener
  socket.on("createMessage", (message, cbck) => {
    // Emmits event globaly;
    // io.emit
    console.log("Created message");
    io.emit("newMessage", generateMessage(message.from, message.text));
  
    cbck("This is from the server");
  });
});


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



server.listen(PORT, console.log(`App listening on port ${PORT}`));