
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const users = [];

console.log("WebSocket działa na porcie 8080");
console.log("Połączeni użytkownicy: " + users);

wss.on("connection", (ws) => {
    console.log("Nowy użytkownik połączony");


    ws.on("message", (message) => {
        const data = JSON.parse(message);

        // dodawanie użytkownika do listy aktywnych
        if(data.type === "join"){
            if(users.includes(data.nickname)){

                ws.send(JSON.stringify({
                    type: "error",
                    message: "Użytkownik o tym nicku korzysta aktualnie z aplikacji. Wybierz inny nick.s"
                }));

                console.log("Nieudane polaczenie uzytkownika - nieprawidlowy login")

                return;
            }
            else{

            }
            ws.nickname = data.nickname;

            users.push(data.nickname);

            broadcastUsers();
            showUsers(users)


        }

        console.log("Odebrano:", data);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    // usuwanie z listy aktywnych
    ws.on("close", () => {
        const index = users.indexOf(ws.nickname);

        if(index !== -1){
            users.splice(index, 1);
        }
        showUsers(users)
        broadcastUsers();
    });

});

function broadcastUsers(){
    const message = JSON.stringify({
        type: "users",
        users: users
    });

    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    });
}
function showUsers(users){
    console.log("Połączeni użytkownicy:");
    users.forEach(user => console.log(user));
}