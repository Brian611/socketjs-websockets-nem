// Load nem-browser library
const nem = require("nem-sdk").default;
const WebSocket = require('ws');
const { connect } = require("./functions/nemHelpers");

const wss = new WebSocket.Server({ port: 3002 });
const timeout = ms => new Promise(res => setTimeout(res, ms))

wss.on('connection', (ws) => {

    ws.on('message', async function incoming(message) {
        let addr = "";
        let response = JSON.parse(message);
        if (response.eventType == "address") {
            addr = response.addr;
        }
        await timeout(1000);
        console.log('address : %s', addr);

        // Create an NIS endpoint object
        var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

        var connector = nem.com.websockets.connector.create(endpoint, addr);

        // Try to establish a connection
        connect(connector, ws);

        console.log("From server: ", addr);
    });

    ws.on('close', function close() {
        console.log(`disconnected : ${addr}`);
    });

});