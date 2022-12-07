const express = require("express")
const {listen}  = require('socket.io')
const app = express();
const server = require('http').createServer(app)
var io = require('socket.io')(server)
let users  = [];
let connections = [];
server.listen(3000,()=>{
    console.log(`sever is running at ${3000}`)
} );

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
io.sockets.on("connection",function  (socket){
    connections.push(socket);
    console.log("connected : %s sockets connected",connections.length);
    socket.on("disconnect",function  (data){
        users.splice(users.indexOf(socket.username),1)
        connections.splice(connections.indexOf(socket),1)
        console.log("disconnected: %s sockets connected",connections.length)
    })
    socket.on("send message",function  (data){
        io.sockets.emit("new message",{msg:data,user:socket.username})
    })
    socket.on("new user",function  (data,callback){
        callback(true)
        socket.username = data
        users.push(socket.username)
        updateUsernames()
    }
    )
    function updateUsernames(){
        io.sockets.emit("get users",users)
    }

   
})

console.log("server is listening")