const path = require("path");
const http = require("http");
const express = require("express");
const PORT = process.env.PORT || 3000;
const socketIO = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on("connection", (socket)=>{
  console.log("New user connected!");
  socket.on("disconnect", ()=>{
    console.log("Client disconnected");
  });
});


const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));



server.listen(PORT, console.log(`App listening on port ${PORT}`));