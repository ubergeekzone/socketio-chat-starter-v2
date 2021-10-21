var encrypt = require(__dirname+"/encrypt.js");

var messages = function() {
   
    var self = this;

    self.send = function(io, socket, workspace, user, callback) {
        socket.on('room', function(obj) {
            message_encrypt = encrypt.encrypt(obj.msg, user.secrectKey);
            //db insert goes here
            message_decrypt = encrypt.decrypt(message_encrypt,  user.secrectKey);
            console.log(obj.room);
            io.of(workspace.name).to(obj.room).emit('updateMessages', {data: user,  msg: message_decrypt});
        });
    }

    self.direct = function(socket, workspace, user, callback) {
        socket.on("direct", function(obj) {
            message_encrypt = encrypt.encrypt(obj.msg, user.secrectKey);
            //db insert goes here
            message_decrypt = encrypt.decrypt(message_encrypt,  user.secrectKey);
            if(user.socketID === obj.socketID) {
                socket.emit("direct", obj);
            }
            socket.emit("direct",  {data: user,  msg: message_decrypt, to: user.socketID, from: user.socketID});

            socket.to(obj.socketID).emit("direct",  {data: user,  msg: message_decrypt, to: obj.socketID, from: user.socketID});
            callback(obj);
        });
    }

}

module.exports = messages;