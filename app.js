// Load nem-browser library
var nem = require("nem-sdk").default;
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3002 });

wss.on('connection', function connection(ws) {
    let addr = "";
    ws.on('message', function incoming(message) {
        let response = JSON.parse(message);
        if (response.eventType == "address") {
            addr = response.addr;
        }
        console.log('address: %s', message);
    });

    // Create an NIS endpoint object
    var endpoint = nem.model.objects.create("endpoint")("http://50.3.87.123", nem.model.nodes.websocketPort);
    // Create a connector object
    var connector = nem.com.websockets.connector.create(endpoint, addr);
    // Try to establish a connection
    connect(connector, ws);

    // Connect using connector
    function connect(connector, ws) {
        return connector.connect().then(function () {
            // Set time
            date = new Date();

            // If we are here, we are connected
            console.log(date.toLocaleString() + ': Connected to: ' + connector.endpoint.host);

            // Show event
            console.log(date.toLocaleString() + ': Subscribing to errors');

            // Subscribe to errors channel
            nem.com.websockets.subscribe.errors(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                console.log(date.toLocaleString() + ': Received error');
                // Show data
                console.log(date.toLocaleString() + ': ' + JSON.stringify(res));
            });

            // Show event
            console.log(date.toLocaleString() + ': Subscribing to unconfirmed transactions of ' + connector.address);

            // Subscribe to unconfirmed transactions channel
            nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                console.log(date.toLocaleString() + ': Received unconfirmed transaction');
                // Show data
                console.log(date.toLocaleString() + ': ' + JSON.stringify(res));
                ws.send(JSON.stringify({ unconfirmed: res }));
            });

            // Show event
            console.log(date.toLocaleString() + ': Subscribing to confirmed transactions of ' + connector.address);

            // Subscribe to confirmed transactions channel
            nem.com.websockets.subscribe.account.transactions.confirmed(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                console.log(date.toLocaleString() + ': Received confirmed transaction');
                // Show data
                console.log(date.toLocaleString() + ': ' + JSON.stringify(res));
                ws.send(JSON.stringify({ confirmed: res }));
            });

        }, function (err) {
            // Set time
            date = new Date();
            // Show event
            console.log(date.toLocaleString() + ': An error occured');
            // Show data
            console.log(date.toLocaleString() + ': ' + JSON.stringify(err));
            // Try to reconnect
            reconnect();
        });
    }

    function reconnect() {
        // Replace endpoint object
        endpoint = nem.model.objects.create("endpoint")("http://bob.nem.ninja", 7778);
        // Replace connector
        connector = nem.com.websockets.connector.create(endpoint, address);
        // Set time
        date = new Date();
        // Show event
        console.log(date.toLocaleString() + ': Trying to connect to: ' + endpoint.host);
        // Try to establish a connection
        connect(connector);
    }
    ws.on('close', function close() {
        console.log(`disconnected : ${addr}`);
    });
});