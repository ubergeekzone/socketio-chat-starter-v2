var events = function() {
    
    var self = this;
  
    self.exit = function(io, socket, workspace, roomName, user) {
        io.of(workspace.name).to(roomName).emit('exit', user +' has went offline'); // broadcast to everyone in the room
    };
  
    self.join = function(io, socket, workspace, roomName, user) {
        io.of(workspace.name).to(roomName).emit('join', user +' has joined the room'); // broadcast to everyone in the room
    };
  
    self.leave = function(io, socket, workspace, roomName, user) {
        io.of(workspace.name).to(roomName).emit('leave', user +' has left the room'); // broadcast to everyone in the room
    };
  
  };
  
  module.exports = events;