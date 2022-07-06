"use strict";

//get global settings
let backend_settings = require('./backend_settings.json');
//import miner IPs
//array of [{"HostName": host, "isAlive": bool}, {"HostName": host, "isAlive": bool}]



let serverPort = backend_settings.backend_server_port;
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

let app = express();
//load a statix index.html with the root / route. you can basically place any static website or production vue
app.use(express.static(__dirname + '../MinerManager/dist'));
const server = http.createServer(app);
const websocketServer = new WebSocket.Server({ server });

//if no parameter set then we take default port
const myArgs = process.argv.slice(2);
if (myArgs.length == 1){
  serverPort=parseInt(myArgs[0]);
}else{
  console.log('Usage: node PROGRAM.js PORT\nDefaults set to: ' + serverPort);
}

//when a websocket connection is established
websocketServer.on("connection", (webSocketClient) => {
  // send feedback to the incoming connection
/*   webSocketClient.send("The time is: ");
  setInterval(() => {
    let time = new Date();
    webSocketClient.send("The time is: " + time.toTimeString());
  }, 1000); */
  
  if(backend_settings.debug_level)console.log('Client connected from URL: ' + webSocketClient.url);
});



//start the web server
server.listen(serverPort, () => {
  if(backend_settings.debug_level)console.log("Websocket server started on port " + serverPort);
});

//check first time for miner data
{//local scope for garbage collector
  if(backend_settings.debug_level)console.log('backend_RESTful::Read from all hosts first time.');
  let dt = require('./ping_hosts.js');
  let miner_ips = JSON.parse(JSON.stringify(backend_settings.minerips));
  dt.pinghosts(miner_ips);

  //update ws clients with an intervall of 1 secs
  setTimeout(update_ws_clients, 1000, miner_ips);
}

//ping miners and check for miner info in a timed loop
//properties of hosts object which will be populated by the miner_client with recent miner details
setInterval(() => {
  //check health status of each miner/host. Results are udpated in the this.miner_ips array
    if(backend_settings.debug_level)console.log('backend_RESTful::setInterval():Read from all hosts.');
    let dt = require('./ping_hosts.js');
    let miner_ips = JSON.parse(JSON.stringify(backend_settings.minerips));
    dt.pinghosts(miner_ips);
    //update ws clients with an intervall of 1 secs
    setTimeout(update_ws_clients, 1000, miner_ips);

}, backend_settings.miner_request_interval_msecs);

function update_ws_clients(miner_ips){
  if(backend_settings.debug_level)console.log('Number of clients associated with the websocket ' + websocketServer.clients.size);
  websocketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      //client.send(data, { binary: isBinary });
      client.send(JSON.stringify(miner_ips, null, 2));
    }
  });
}