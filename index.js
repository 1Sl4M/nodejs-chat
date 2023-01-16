const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const { writeFile } = require('fs')

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("upload", (file, callback) => {
        console.log(file); // <Buffer 25 50 44 ...>

        // save the content to the disk, for example
        writeFile("/tmp/upload", file, (err) => {
            callback({ message: err ? "failure" : "success" });
        });
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat", message);
    });
});

server.listen(5000, (err)=>{
    console.log("Server is started")
    if(err){
        console.log("Ошибка: ", err)
    }
})