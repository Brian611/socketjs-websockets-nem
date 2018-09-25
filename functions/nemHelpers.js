const nem = require("nem-sdk").default;

function reconnect() {
    return new Promise((resolve, reject) => {
        // Replace endpoint object
        endpoint = nem.model.objects.create("endpoint")("http://50.3.87.123", 7778);
        // Replace connector
        connector = nem.com.websockets.connector.create(endpoint, addr);
        // Set time
        date = new Date();
        // Show event
        console.log(date.toLocaleString() + ': Trying to connect to: ' + endpoint.host);
        // Try to establish a connection
        resolve(connect(connector));
    })
}


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

    }, async (err) => {
        // Set time
        date = new Date();
        // Show event
        console.log(date.toLocaleString() + ': An error occured');
        // Show data
        console.log(date.toLocaleString() + ': ' + JSON.stringify(err));
        // Try to reconnect
        await reconnect();
    });
}




module.exports = {
    connect
}