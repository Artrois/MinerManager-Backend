"use strict";

/* 
const myArgs = process.argv.slice(2);
//if (myArgs.length <2){
  //console.log('Usage: node PROGRAM.js IP PORT command \nNot enough arguments -> exit client');
  //process.exit(1);
//}
let i_port=4028;
let s_IP='localhost';
let s_command='summary';
if (myArgs.length == 3){
  i_port=parseInt(myArgs[1]);
  s_IP=myArgs[0];
  s_command=myArgs[2];
}else{
  console.log('Usage: node PROGRAM.js IP PORT command \nDefaults set to: localhost 4028 summary');
}

connect_to_miner({"HostName": s_IP, "port": i_port, "isAlive": true}); 
 */

let backend_settings = require('./backend_settings.json');
let net = require('net');

exports.connect_to_miner = function(miner_host){
 
  //console.log('Connecting to ' + myArgs[0] + ':' + myArgs[1]);
  this.miner_host = miner_host;
  //******collect summary data
  const socket_sum = net.connect(miner_host.port, miner_host.HostName, () => {
      socket_sum.write('{"cmd":"summary"}');
      //sleep for 200msec
     // await new Promise(r => setTimeout(r, 200));
  });
  socket_sum.on('error', (err) => {
    this.miner_host.dirty = true;
    this.miner_host.isAlive = false;
    if(backend_settings.debug_level)console.log('Socket closed with errors:');
    if(backend_settings.debug_level)console.log(err);
  });
  socket_sum.on('data', (data, miner_host) => {
    let recv_string = data.toString();
    let recv_json = JSON.parse(recv_string);
    //use stringify to flatten/remove CRLFs from json response bcause this is what expects telegraf
    //console.log(JSON.stringify(recv_json));
    delete this.miner_host.summary;//to overcome memory leaks
    this.miner_host.summary = recv_json;
    //console.log('fake_clinet::connect_to_miner:socket_sum: ' + JSON.stringify(this.miner_host));
    socket_sum.end();
    //return recv_json;
  }); 
  socket_sum.on('end', () => {
    if(backend_settings.debug_level)console.log('socket_sum disconnected from server');
  });

  //*****collect pools data
  const socket_pools = net.connect(miner_host.port, miner_host.HostName, () => {
    //sleep for 200msec
   // await new Promise(r => setTimeout(r, 200));
    socket_pools.write('{"cmd":"pools"}');
  });
  socket_pools.on('error', (err) => {
    this.miner_host.dirty = true;
    this.miner_host.isAlive = false;
    if(backend_settings.debug_level)console.log('Socket closed with errors:');
    if(backend_settings.debug_level)console.log(err);
  });
  socket_pools.on('data', (data, miner_host) => {
    let recv_string = data.toString();
    let recv_json = JSON.parse(recv_string);
    //use stringify to flatten/remove CRLFs from json response bcause this is what expects telegraf
    //console.log(JSON.stringify(recv_json));
    delete this.miner_host.pools;
    this.miner_host.pools = recv_json;
    //console.log('fake_clinet::connect_to_miner:socket_pools: ' + JSON.stringify(this.miner_host));
    socket_pools.end();
  //return recv_json;
  }); 
    socket_pools.on('end', () => {
      if(backend_settings.debug_level)console.log('socket_pools disconnected from server');
  });

  //********collect edevs data */
  const socket_edevs = net.connect(miner_host.port, miner_host.HostName, () => {

    socket_edevs.write('{"cmd":"edevs"}');

  });
  socket_edevs.on('error', (err) => {
    this.miner_host.dirty = true;
    this.miner_host.isAlive = false;
    if(backend_settings.debug_level)console.log('Socket closed with errors:');
    if(backend_settings.debug_level)console.log(err);
  });
  socket_edevs.on('data', (data, miner_host) => {
    let recv_string = data.toString();
    let recv_json = JSON.parse(recv_string);
    //use stringify to flatten/remove CRLFs from json response bcause this is what expects telegraf
    //console.log(JSON.stringify(recv_json));
    delete this.miner_host.edevs;
    this.miner_host.edevs = recv_json;
    //console.log('fake_clinet::connect_to_miner:socket_edevs: ' + JSON.stringify(this.miner_host));
    socket_edevs.end();
    //return recv_json;
  }); 
  socket_edevs.on('end', () => {
    if(backend_settings.debug_level)console.log('socket_edevs disconnected from server');
  });

//********collect psu data */
const socket_psu = net.connect(miner_host.port, miner_host.HostName, () => {

    socket_psu.write('{"cmd":"get_psu"}');

  });
  socket_psu.on('error', (err) => {
    this.miner_host.dirty = true;
    this.miner_host.isAlive = false;
    if(backend_settings.debug_level)console.log('Socket closed with errors:');
    if(backend_settings.debug_level)console.log(err);
  });
  socket_psu.on('data', (data, miner_host) => {
    let recv_string = data.toString();
    let recv_json = JSON.parse(recv_string);
  //use stringify to flatten/remove CRLFs from json response bcause this is what expects telegraf
    //console.log(JSON.stringify(recv_json));
    delete this.miner_host.psu;
    this.miner_host.psu = recv_json;
    //console.log('fake_clinet::connect_to_miner:socket_psu: ' + JSON.stringify(this.miner_host));
    socket_psu.end();
  //return recv_json;
  }); 
  socket_psu.on('end', () => {
    if(backend_settings.debug_level)console.log('socket_psu disconnected from server');
  });

  //*******collect error codes */
  const socket_errors = net.connect(miner_host.port, miner_host.HostName, () => {

    socket_errors.write('{"cmd":"get_error_code"}');

  });
  socket_errors.on('error', (err) => {
    this.miner_host.dirty = true;
    this.miner_host.isAlive = false;
    if(backend_settings.debug_level)console.log('Socket closed with errors:');
    if(backend_settings.debug_level)console.log(err);
  });
  socket_errors.on('data', (data, miner_host) => {
    let recv_string = data.toString();
    let recv_json = JSON.parse(recv_string);
    //use stringify to flatten/remove CRLFs from json response bcause this is what expects telegraf
    //console.log(JSON.stringify(recv_json));
    delete this.miner_host.error_codes;
    this.miner_host.error_codes = recv_json;
    //console.log('fake_clinet::connect_to_miner:socket_errors: ' + JSON.stringify(this.miner_host));
    socket_errors.end();
    //return recv_json;
  }); 
  socket_errors.on('end', () => {
    if(backend_settings.debug_level)console.log('socket_errors disconnected from server');
  });
}

