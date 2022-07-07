"use strict";

//get global settings
let backend_settings = require('./backend_settings.json');
//import miner IPs
//array of [{"HostName": host, "isAlive": bool}, {"HostName": host, "isAlive": bool}]

//here we store our clients. .keys() will return an error of WS clients and with metadata = { id, verified }
const clientsMap = new Map();

let serverPort = backend_settings.backend_server_port;
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require("http");
const WebSocket = require("ws");
const { v4 } = require('uuid');


let app = express();
let URL = path.join(__dirname, '../MinerManager-UI/dist');
//set static route to production build of the client app created with vite. This shall be static production build. it wont work
//with vue app. For vue app processing we need to use vue SSR plugin or nuxt.
app.use(express.static(URL));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//here you can put your preprocessed vue page
app.get('/landing-page', (req, res) => {
  res.sendFile(URL + '/index.html');
}); 

//we set route to commands where we POST miner commands will be sent to
app.post('/commands', (req, res) => {
  // res.send(`Hi! Server is listening on port ${port}`)
  //var resp = JSON.parse('{ "message": "Hi! Server is listening on port", "port": 0 }');
  //resp.port=backend_port;
  //res.json(resp);
  //res.json(miner_ips);
  if(backend_settings.debug_level > 1)console.log('POST request received with body:');
  if(backend_settings.debug_level > 1)console.log(req.body);
});

const server = http.createServer(app);
const websocketServer = new WebSocket.Server({ server });



//when a websocket connection is established
websocketServer.on("connection", (webSocketClient) => {
  // send feedback to the incoming connection
/*   webSocketClient.send("The time is: ");
  setInterval(() => {
    let time = new Date();
    webSocketClient.send("The time is: " + time.toTimeString());
  }, 1000); */
    const id = v4();
    let verified = false;
    const metadata = { id, verified };

    clientsMap.set(webSocketClient, metadata);
    webSocketClient.on("message", process_client_data);
    webSocketClient.on("close", () => {clientsMap.delete(webSocketClient);});

    if(backend_settings.debug_level == 2)console.log('Client connected with metadata: ' + JSON.stringify(metadata));
  }
);

//when a websocket client is sending a message
/* websocketServer.on("message", (data) => {
  const message = JSON.parse(data);
  if(backend_settings.debug_level == 2)console.log('Client connected from URL: ' + webSocketClient.url + ', message: ' + message);
}); */

//if no parameter set then we take default port
const myArgs = process.argv.slice(2);
if (myArgs.length == 1){
  serverPort=parseInt(myArgs[0]);
}else{
  console.log('Usage: node PROGRAM.js PORT\nDefaults set to: ' + serverPort);
}

//start the web server
server.listen(serverPort, () => {
  if(backend_settings.debug_level  == 2)console.log("Websocket server started on port " + serverPort);
});

//check first time for miner data
{//local scope for garbage collector
  if(backend_settings.debug_level  == 1)console.log('backend_RESTful::Read from all hosts first time.');
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
    if(backend_settings.debug_level == 1)console.log('backend_RESTful::setInterval():Read from all hosts.');
    let dt = require('./ping_hosts.js');
    let miner_ips = JSON.parse(JSON.stringify(backend_settings.minerips));
    dt.pinghosts(miner_ips);
    //update ws clients with an intervall of 1 secs
    setTimeout(update_ws_clients, 1000, miner_ips);

}, backend_settings.miner_request_interval_msecs);

function update_ws_clients(miner_ips){
  if(backend_settings.debug_level == 1)console.log('Number of clients associated with the websocket ' + websocketServer.clients.size);
  websocketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      //client.send(data, { binary: isBinary });
      client.send(JSON.stringify(miner_ips, null, 2));
    }
  });
}

/**receives data = {"time_stamp": null, "data": null} */
function process_client_data(data){
  const message = JSON.parse(data);
  if(backend_settings.debug_level == 2)console.log('Client message: ' + JSON.stringify(message, 0, 2));
}