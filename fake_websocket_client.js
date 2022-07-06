"use strict";

//get global settings
let backend_settings = require('./backend_settings.json');
//import miner IPs
//array of [{"HostName": host, "isAlive": bool}, {"HostName": host, "isAlive": bool}]
let miner_ips = backend_settings.minerips;


let serverPort = backend_settings.backend_server_port;

let WebSocketClient = require('websocket').client;
let client = new WebSocketClient();

client.connect('ws://localhost:' + serverPort + '/', 'echo-protocol');

client.on('connectFailed', function(error) {
    if(backend_settings.debug_level)console.log('fake_websocket_client::Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    if(backend_settings.debug_level)console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        if(backend_settings.debug_level)console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        if(backend_settings.debug_level)console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if(backend_settings.debug_level)console.log('Received: '); //+ message.utf8Data );
            if(backend_settings.debug_level)console.log(message.utf8Data);
        }
    });
    
/*     function sendMessage() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendMessage, 1000);
        }
    }
    sendMessage(); */
});