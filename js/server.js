const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket działa na porcie 8080");

wss.on("connection", (ws) => {
    console.log("Nowy użytkownik połączony");

    ws.on("message", (message) => {
        console.log("Odebrano:", message.toString());

        // wysłanie do wszystkich
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});