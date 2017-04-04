const path = require("path");
const http = require("http");
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message.js");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// This is momma and pappa, eq. of expresses app.get()
// Its an event handler.
// Arg "socket" stands for connected client.
// On connect, alerts us
io.on("connection", (socket)=>{

  // logs that user connected to server
  console.log("New user connected!");


  // listens to join event
  // checks the param validity
  // executes callback with error if any
  // triggering kick/redirect on client
  socket.on("join", function(params, cbck){
    if (!isRealString(params.name) || !isRealString(params.room)){
      return cbck("Name and room name are required.");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    // emits default welcome message visible only to current user
    socket.emit("newMessage",
                generateMessage("Admin",
                "Welcome to the chat"));

    // Emits alert message to all but currently connected user
    socket.broadcast.to(params.room).emit("newMessage", 
                          generateMessage("Admin",
                          `${params.name} has joined the chat!`));

    cbck();
  });
  // DC handler
  socket.on("disconnect", ()=>{
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin",
      `${user.name} has left the room`));
    }
  });
  
  // CREATEMESSAGE listener
  socket.on("createMessage", (message, cbck) => {
    // Emmits newMessage event to all connected users;
    // using io.emit
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }

    
    
    //execs callback provided at client side
    cbck();
  });

  // Location sharing handler
  socket.on("createLocationMessage", (coords)=>{

    var user = users.getUser(socket.id);

    io.to(user.room).emit("newLocationMessage", 
            generateLocationMessage(user.name,
             coords.latitude, coords.longitude));
  });
});


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



server.listen(PORT, console.log(`App listening on port ${PORT}`));