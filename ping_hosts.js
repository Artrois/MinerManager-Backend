"use strict";

 var ping = require('ping');
 let backend_settings = require('./backend_settings.json');
 let dt = require('./miner_client.js');

 //console.log('Timestamp: ' + getDateTime());

// pinghosts(backend_settings.minerips);

 //function that receives an array of [{"HostName": host, "isAlive": bool}, {"HostName": host, "isAlive": bool}]
 exports.pinghosts = function(hosts){


    //let ret_hosts = [];
    hosts.forEach((host) => {
           
        host.dirty = true;//mark that we have outdated data, set to false once fresh data received
        host.timestamp = getDateTime();
        if(backend_settings.debug_level == 1)console.log('ping host: ' + host.HostName);
        ping.sys.probe(host.HostName, function(isAlive){
            if (isAlive == null) return;//skip phantom probe results
            host.isAlive = isAlive;
            if(backend_settings.debug_level == 1)console.log(host.HostName + ' is alive ' + isAlive);
            //ret_hosts.push({"HostName": host.HostName, "port": host.port, "isAlive": isAlive});
            //host.timestamp = this.getDateTime(new Date());
            //console.log('Timestamp: ' + host.timestamp);
            if (isAlive){
               // try {
                    if(backend_settings.debug_level == 1)console.log('trying to connect to host: ');
                    if(backend_settings.debug_level == 1)console.log(host);
                    dt.connect_to_miner(host);
               // } catch (error) {
                    //console.log('reception failed from host=%s', host.HostName)
                //}
                host.dirty = false;
              }
            if(backend_settings.debug_level == 1)console.log('dump miner hosts: ');
            if(backend_settings.debug_level == 1)console.log(hosts)
        });
    });
   
}

function getDateTime() {
    var now     = new Date(); 
     var year    = now.getFullYear();
     var month   = now.getMonth()+1; 
     var day     = now.getDate();
     var hour    = now.getHours();
     var minute  = now.getMinutes();
     var second  = now.getSeconds(); 
     if(month.toString().length == 1) {
          month = '0'+month;
     }
     if(day.toString().length == 1) {
          day = '0'+day;
     }   
     if(hour.toString().length == 1) {
          hour = '0'+hour;
     }
     if(minute.toString().length == 1) {
          minute = '0'+minute;
     }
     if(second.toString().length == 1) {
          second = '0'+second;
     }   
     var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
      return dateTime;
   }

 

