var stomp = require('stompjs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3002 });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        let response = JSON.parse(message);
        if (response.eventType == "address") {
            addr = response.addr;
        }
        console.log('address: %s', message);
    });
    console.log("==============================");

    let stompClient = stomp.overWS('ws://50.3.87.123:7778/w/messages/websocket');
    let addr = "";
    stompClient.debug = undefined;
    stompClient.connect({}, function (frame) {
        stompClient.subscribe(`/unconfirmed/${addr}`,
            function (data) {
                var body = JSON.parse(data.body);
                console.log("unconfirmed: ", body);
                ws.send(JSON.stringify({ unconfirmed: body }));
            });

        stompClient.subscribe(`/transactions/${addr}`,
            function (data) {
                var body = JSON.parse(data.body);
                console.log("confirmed: ", body);
                ws.send(JSON.stringify({ confirmed: body }));
            });
    });

    ws.on('close', function close() {
        console.log(`disconnected : ${addr}`);
    });

});
