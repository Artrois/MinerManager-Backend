# MinerManager Backend

This project is created with JScript and Node.js/Express. There is another complementary project for the [front-end](https://github.com/Artrois/MinerManager-UI.git).
The backend is supposed to collect data from Whatsminer 30S (JSON formatted) and send it in regular intervals via WebSocket to the front-end/UI. The UI in turn will render an overview dashboard showing most significant KPIs and it will also render tables with details for each miner. 
The UI is modular and can be extended with custom vue components to accomodate support for other Miners. More tricky modifications will need to be applied to the backend to support other miners than Whatsminer 30S.

## Project setup
```sh
sudo apt install nodejs npm
npm i cors express body-parser ping websocket ws
```

## Usage
There is WebSocket server and RESTful server. RESTful not tested. 
To run WebSoscket server:
```sh
node backend_websocket.js
```
This will open a WS port 8000 and will listen to incoming connections from UI.
Change port and server settings in backend_settings.json.

## Testing UI and backend
Use fake_websocket_client.js to emulate UI.
Use fake_miner.js to emulate a fake WhatsMiner 30S+.
```sh
node fake_miner.js
```
This will start a webserver and will listen on 4028 for GET queries. 4028 is the default port from WhatsMiner. To change the port edit backend_settings.json.
