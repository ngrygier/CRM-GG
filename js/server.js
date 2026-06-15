// start serwera (webSocket + express)

const express = require("express");
const http = require("http");
const cors = require("cors");
const WebSocket = require('ws');

const app = express();
app.use(cors());

const path = require("path");
app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);


const server = http.createServer(app);

const wss  = new WebSocket.Server({
    server
});

server.listen(8080, () =>{
    console.log("Serwer dziala na porcie 8080");
})

// multer - dodawanie załączników
const multer = require("multer");


// konfiguracja uploadów
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(
            null,
            path.join(
                __dirname,
                "..",
                "public",
                "uploads"
            )
        );
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


// walidacja typów
const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf"
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(
                new Error("Nieobsługiwany typ pliku"),
                false
            );
        }
    }
});

// upload wysłanych załączników
app.post(
    "/upload",
    (req, res) => {

        upload.single("attachment")(req, res, (err) => {

            if (err) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                fileName: req.file.filename
            });
        });
    }
);

// tablica dla aktywnych użytkowników
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