var rooms = function() {
    
    var self = this;

    self.join = function(socket, workspace, user, onlineRoomList, callback) {
        socket.on("joinRoom", function(roomName) {
            socket.join(roomName);
            var userObj = {socketID: null, room: null, data: {}};
            if(socket.rooms.has(socket.id) === true) {
              var f = socket.rooms;
              f.forEach(function(value, key, set) {
                if(value === socket.id) {
                  userObj.socketID = socket.id;
                  userObj.data = workspace.sockets.get(socket.id).data;
                } else {
                  userObj.room = value;
                }
            })
            onlineRoomList.push(userObj)
            }
            workspace.emit("onlineRoomUserList", onlineRoomList);
            callback(roomName, user);
        });
    },

    self.users = function(socket, workspace, obj) {
        var index = obj.findIndex(online => online.socketID === socket.id);
        obj.splice(index,1);
        workspace.emit("onlineRoomUserList", obj);
    },

    self.leave = function(socket, workspace, user, onlineRoomList, callback) {
        socket.on("leaveRoom", function(roomName) {
            socket.leave(roomName);
            self.users(socket, workspace, onlineRoomList);
            callback(roomName, user);
        });
    }

}

module.exports = rooms;