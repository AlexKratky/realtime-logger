/**
    * @name        realtime-logger.js
    * @version     v0.1.0 (14-4-2020)[dd-mm-yyyy]
    * @link        https://alexkratky.com          Author website
    * @author      Alex Kratky <alex@panx.dev>
    * @copyright   Copyright (c) 2020 Alex Kratky
    * @license     http://opensource.org/licenses/mit-license.php  MIT License
    * @description Realtime logger.
*/
var fs = require('fs');

var configPath = './logger.config.json';
var config = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

var http = require('http');
var https = require('https');
if(config.secured) {
    var privateKey = fs.readFileSync(config.privateKey, 'utf8');
    var certificate = fs.readFileSync(config.certificate, 'utf8');
    var credentials = { key: privateKey, cert: certificate };
}
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var port = config.port;
var util = require('util');

if(config.secured) {
    var webServer = https.createServer(credentials, app);
    webServer.listen(port, function () {
        console.log('Server running on: https://' + config.server + ':' + port);
    });
} else {
    var webServer = http.createServer(app);
    webServer.listen(port, function () {
        console.log('Server running on: http://' + config.server + ':' + port);
    });
}


var io = require('socket.io').listen(webServer, { log: false });

var timeLog = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
var log_file = ((config.log) ? fs.createWriteStream(__dirname + '/realtime-logger-' + timeLog + '.log', { flags: 'w' }) : null);
var log_stdout = process.stdout;

console.log = function (d, type = 0, log = true) {
    var timeLog = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    if(type == 0) {
        //INFO
        if(log && config.log) {
            log_file.write("[INFO]["+timeLog+"] " + util.format(d) + '\n');
        }
        log_stdout.write("[INFO][" + timeLog + "] " + util.format(d) + '\n');
    } else {
        //ERROR
        if (log && config.log) {
            log_file.write("[ERROR]["+timeLog+"] " + util.format(d) + '\n');
        }
        log_stdout.write("[ERROR][" + timeLog + "] " + util.format(d) + '\n');
    }
};

io.on('connection', function (socket) {
    console.log("Socket connection");    
    socket.on('log', function (data) {
        console.log('New log: ' + data);
        socket.broadcast.emit('log', data);
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnection");
    });
});


var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/', urlencodedParser, function (req, res) {
    //console.log(req.body);
    if (!req.body) return res.sendStatus(400);
    var post = req.body;
    if (post.password == config.password) {

        io.emit('log', JSON.parse(post.data));
        console.log("New data: " + post.data);
        res.send('true');

    } else {
        res.sendStatus(400);
    }

});

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    var server = config.server;
    var port = config.port;
    var secured = config.secured;
    res.render('logger.html', { server: server, port: port, secured: secured });
});

app.use(express.static('jsonview'));

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    d = d.toString().trim();
    if(d == "check") {
        check(false);
    }
});