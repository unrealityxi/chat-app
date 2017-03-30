const path = require("path");
const http = require("http");
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketIO = require("socket.io");
const {generateMessage, generateLocationMessage} = require("./utils/message.js");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


// This is momma and pappa, eq. of expresses app.get()
// Its an event handler.
// Arg "socket" stands for connected client.
// On connect, alerts us
io.on("connection", (socket)=>{

  // logs that user connected to server
  console.log("New user connected!");

  // emits default welcome message visible only to current user
  socket.emit("newMessage",
              generateMessage("Admin",
               "Welcome to the chatroom"));

  // Emits alert message to all but currently connected user
  socket.broadcast.emit("newMessage", 
                        generateMessage("Admin",
                         "New user joined!"));

  // DC handler
  socket.on("disconnect", ()=>{
    console.log("Client disconnected");
  });
  
  // CREATEMESSAGE listener
  socket.on("createMessage", (message, cbck) => {
    // Emmits newMessage event to all connected users;
    // using io.emit
    console.log("Created message");
    io.emit("newMessage", generateMessage(message.from, message.text));
    
    //execs callback provided at client side
    cbck();
  });

  // Location sharing handler
  socket.on("createLocationMessage", (coords)=>{
    io.emit("newLocationMessage", 
            generateLocationMessage("User",
             coords.latitude, coords.longitude));
  });
});


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



server.listen(PORT, console.log(`App listening on port ${PORT}`));