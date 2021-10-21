const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
var path = require('path');
var axios = require('axios');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {  cors: {
  origin: "*",
  methods: ["GET", "POST"]
} });

var online = {
    list: [],
    rooms: []
  }

var connections = require(__dirname+"/connections.js");
var connections = new connections();

var rooms = require(__dirname+"/rooms.js");
var rooms = new rooms();

var events = require(__dirname+"/events.js");
var events = new events();

var messages = require(__dirname+"/messages.js");
var messages = new messages();

var chat = path.join(__dirname, '/../client/');
app.use('/', express.static(chat));

//console.log(fetchUser());

/*io.of(/[A-Za-z]/).use((socket, next) => {

  const err = new Error("authorized already");
  err.data = { content: "you can only connect once to the server" }; 
  next(err);

});*/

io.of(/[A-Za-z]/).on("connection", (socket) => {
  
  const workspace = socket.nsp;

    connections.connect(socket, workspace, online, function(user) {

      rooms.join(socket, workspace, user, online.rooms, function(roomName, user) {
        events.join(io, socket, workspace, roomName, user.user_login);
      });
    
      rooms.leave(socket, workspace, user, online.rooms, function(roomName, user) {
        events.leave(io, socket, workspace, roomName, user.user_login);
      });

      messages.send(io, socket, workspace, user, function(message) {
        console.log(message)
      });

      messages.direct(socket, workspace, user, function(message) {
        console.log(message)
      });

      connections.disconnect(socket, workspace, online, user, function(roomName, reason) {
        events.exit(io, socket, workspace, roomName, user.user_login);
        console.log(reason);
      });

    });
  
});

httpServer.listen(7000);