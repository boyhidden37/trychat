const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(8080);
const io = socketIO(server);
const path = require("path");

var users = {};
var name = '';
var url = require('url');
app.get('/:name', function(req, res){
    name = req.params.name;
	var q = url.parse(req.url, true);
	var qdata = q.query;
	res.sendFile(path.join(__dirname, "/"+qdata.u));
});
io.sockets.on("connection", function(socket){
    users[socket.id] = name;
    // node
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });
    socket.on("node new message", function(data){
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });

    // python
    socket.on("pRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("pnu", users[socket.id] + " new user has joined");
    });

    socket.on("python new message", function(data){
        io.sockets.in("pRoom").emit('python news', users[socket.id] + ": "+ data);
    });
});

