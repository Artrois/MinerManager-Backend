"use strict";



//get global settings
let backend_settings = require('./backend_settings.json');
//import miner IPs
//array of [{"HostName": host, "isAlive": bool}, {"HostName": host, "isAlive": bool}]
let miner_ips = backend_settings.minerips;


// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
/* const router = express.Router();
// add router in express app
app.use("/vue-landing-page",router); */

let backend_port = backend_settings.backend_server_port;

//if no parameter set then we take default port
const myArgs = process.argv.slice(2);
if (myArgs.length == 1){
  backend_port=parseInt(myArgs[0]);
}else{
  console.log('Usage: node PROGRAM.js PORT\nDefaults set to: ' + backend_port);
}

//set static route to production build of the client app created with vite. This shall be static production build. it wont work
//with vue app. For vue app processing we need to use vue SSR plugin or nuxt.
app.use(express.static(path.join(__dirname, '../MinerManager-UI/dist')));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* app.get('/', (req, res) => {
 // res.send(`Hi! Server is listening on port ${port}`)
  var resp = JSON.parse('{ "message": "Hi! Server is listening on port", "port": 0 }');
  resp.port=port;
  res.json(resp);
}); */

//we set route to messages where we respond with miner details
app.get('/messages', (req, res) => {
  // res.send(`Hi! Server is listening on port ${port}`)
  //let resp = JSON.parse('{ "message": "Hi! Server is listening on port", "port": 0 }');
  //resp.port=backend_port;
  //res.json(resp);
  res.json(miner_ips);
}); 

//here you can put your preprocessed vue page
app.get('/landing-page', (req, res) => {
  res.sendFile('C:/Private/myprojects/MinerManager-UI/dist/index.html');
}); 

/* router.get('/vue-landing-page',(req, res) => {
  res.sendFile('../MinerManager/dist/index.html');
});
router.post('/login',(req, res) => {
  let user_name = req.body.user;
  let password = req.body.password;
  console.log('User name = '+ user_name + ', password is ' + password);
  res.end('yes');
}); */

//we set route to commands where we POST miner commands
app.post('/commands', (req, res) => {
  // res.send(`Hi! Server is listening on port ${port}`)
  //var resp = JSON.parse('{ "message": "Hi! Server is listening on port", "port": 0 }');
  //resp.port=backend_port;
  //res.json(resp);
  //res.json(miner_ips);
  if(backend_settings.debug_level)console.log('POST request received with body:');
  if(backend_settings.debug_level)console.log(req.body);
}); 

// listen on the port
app.listen(backend_port);

//check first time for miner data
{//local scope for garbage collector
  if(backend_settings.debug_level)console.log('backend_RESTful::Read from all hosts first time.');
  let dt = require('./ping_hosts.js');
  dt.pinghosts(miner_ips);
}

//ping miners and check for miner info in a timed loop
//properties of hosts object which will be populated by the miner_client with recent miner details
setInterval(() => {
  //check health status of each miner/host. Results are udpated in the this.miner_ips array
    if(backend_settings.debug_level)console.log('backend_RESTful::setInterval():Read from all hosts.');
    let dt = require('./ping_hosts.js');
    dt.pinghosts(miner_ips);

}, backend_settings.miner_request_interval_msecs);




/* // example usage: realtime clock
setInterval(function(){
  currentTime = getDateTime();
  document.getElementById("digital-clock").innerHTML = currentTime;
}, 1000); 

<p id="digital-clock">ddd</p>
<p id="diff">
0
</p>


let init_time = new Date();
setInterval(function(){
 let element = document.getElementById("digital-clock");
 let now = new Date();
  currentTime = getDateTime(now);
  element.innerHTML = currentTime;
	let diff = (now - init_time) % 5000;
	diff = diff >>> 8;
	document.getElementById("diff").innerHTML = diff;
	if ((diff % 5000)==0){
		element.style.backgroundColor = "green"
		}
	 else if ((diff % 5000) && (element.style.backgroundColor =="green")) {
	 	element.style.backgroundColor = "white"
		}
}, 1000);
*/
