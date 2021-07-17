var express = require('express');
var app = express();
app.use(express.static('public'));

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var allUsers = [];
var avatars = [
    'https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_960_720.png',
    'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png',
    'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png'
]

io.on('connection', (socket) => {
    console.log('Client is connected');
    socket.on('message', (username)=> {
        allUsers.push({
            id: socket.id,
            avatar: Math.round(Math.random()*avatars.length-1),
            name: username
        });
        io.emit('sendUserList', allUsers);
    })
    
    socket.on('pingUser', function(user){
        io.to(user).emit('nudgeUser');
    })

    socket.on('disconnect', ()=>{
        console.log('Client has disconnected');
        for(let i =0; i< allUsers.length;i++){
            if (allUsers[i].id == socket.id) {
                allUsers.splice(i,1);
                io.emit('sendUserList', allUsers);
                break;
            }
        }
    })
})

server.listen(3000, function(){
    console.log('Server is running!');
})