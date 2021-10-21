var encrypt = require(__dirname+"/encrypt.js");

var connections = function() {
    
    var self = this;

    self.login = function(socket, workspace, obj, callback) {
        socket.on("login", (user) => {
            callback(user);
        });
    }
    
    self.connect = function(socket, workspace, obj, callback) {
        var index = obj.list.findIndex(online => online.user.user_login === workspace.sockets.get(socket.id).handshake.auth.username);
        if(index <= -1) {
            this.login(socket, workspace, obj, function(user) {
                workspace.sockets.get(socket.id).data.user = user;
                workspace.sockets.get(socket.id).data.user.socketID = socket.id;
                workspace.sockets.get(socket.id).data.user.secrectKey = encrypt.reEncrypt(encrypt.genSerectKey());
                obj.list.push(workspace.sockets.get(socket.id).data)
                workspace.emit("online", obj.list);
                callback(user);
            });
        } else {
            socket.emit("authorized-already", "you are already logged in");
        }
    }

    self.disconnect = function(socket, workspace, obj, user, callback) {
        socket.on("disconnect", (reason) => {
            var index = obj.list.findIndex(online => online.user.socketID === socket.id);
            obj.list.splice(index,1);
            workspace.emit("online", obj.list);
            var index = obj.rooms.findIndex(online => online.socketID === socket.id);
            if(index > -1) {
                callback(obj.rooms[index].room, reason);
                obj.rooms.splice(index,1);
                workspace.emit("onlineRoomUserList", obj.rooms);
            }
        });
    }
}

module.exports = connections;