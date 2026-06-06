

// zmienne
let ws;
let nickname = "";
let shouldReconnect = false;

// stałe

const hamburger = document.querySelector(".hamburger");
const tabs = document.querySelector(".tabs");

const joinBtn = document.getElementById("join");
const clientCard = document.getElementById("client-card");

const messages = document.querySelector(".messages");
const formularzDolaczenia = document.getElementById("formularzDoDolaczenia");

const exportButton = document.getElementById("export-json");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-notes");

// stan websocketów

function showWebSocketState() {

    if (!ws) {
        console.log("WebSocket nie istnieje");
        return;
    }

    switch (ws.readyState) {

        case WebSocket.CONNECTING:
            console.log("Łączenie z serwerem...");
            break;

        case WebSocket.OPEN:
            console.log("Połączono");
            break;

        case WebSocket.CLOSING:
            console.log("Rozłączanie...");
            break;

        case WebSocket.CLOSED:
            console.log("Rozłączono");
            break;
    }
}


// hamburger
hamburger.addEventListener("click", () => {
    tabs.classList.toggle("active");
});

//nie odswiezaj strony
joinBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //tworzenie websocketa po kliknieciu submit
    nickname = document.getElementById("nickname").value.trim();

    if (nickname === "") {
        alert("Aby wyświetlić projekt, podaj swój nick");
        return;
    }
    else{
        ws = new WebSocket("ws://localhost:8080");
        showWebSocketState();
        shouldReconnect = true;

        ws.onopen = () => {

            showWebSocketState();

            ws.send(JSON.stringify(
                {
                type: "join",
                nickname
            }));

            document.querySelector(".formularzDolaczenia").style.display = "none";
            document.getElementById("client-card").style.display = "block";

            // ładowanie historii
            const history = JSON.parse(localStorage.getItem("notesData") || "[]");

            history.forEach(data => {
                const div = document.createElement("div");

                div.innerHTML = `
        <strong>${data.nickname}</strong>: ${data.content}, ${data.dateTime}
    `;

                messages.appendChild(div);
            });
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // obsługa błędu - nick zajęcty
            if(data.type === "error"){
                alert(data.message);
                ws.close();
                clientCard.style.display = "none"
                formularzDolaczenia.style.display = "flex";

                return;
            }

            if(data.type !== "note"){
                console.log("dołączył użytkownik o nicku " + data.nickname)
                return;

            }


            const div = document.createElement("div");

            // drukowanie danych (konsola w przeglądarce)
            console.log("uzytkownik o nicku " + data.nickname + " napisal: "+ data.content +
            ". Godz: "+ data.dateTime);

            // zapis do localStorage
            saveMessage(data);

            // pokazywanie w html
            div.innerHTML = `
            <strong>${data.nickname}</strong>: ${data.content}, ${data.dateTime}
            `;
            messages.appendChild(div);
        };

        // pokazywanie kart po zalogowaniu
        clientCard.style.display = "block";

        // rozłączenie
        ws.onclose = () => {
            showWebSocketState();

            if (shouldReconnect) {
                reconnect();
            }
        };

        joinBtn.addEventListener("click", () => {
            clientCard.style.display = "block";
        });

        joinBtn.addEventListener("click", () => {
            document.querySelector(".formularzDolaczenia").style.display = "none";
            clientCard.style.display = "block";
        });

        // blokowanie przeladowania strony po wypisaniu formularza
        document.getElementById("notes-input").addEventListener("submit", (e)=>{
            e.preventDefault();

            if (ws.readyState === WebSocket.OPEN) {

                ws.send(JSON.stringify({
                    type: "note",
                    content: messageInput.value,
                    nickname,
                    dateTime: new Date().toLocaleString("pl-PL")
                }));

            } else {

                alert("Brak połączenia z serwerem");
                showWebSocketState();
            }
        });

    }

    // funkcja zapisywania wiadomości za pomocą localStorage
    function saveMessage(noteData){
        const notes = JSON.parse(localStorage.getItem("notesData") || "[]");
        notes.push(noteData);

        localStorage.setItem("notesData", JSON.stringify(notes));
    }


    // eksport historii notatek do JSON
    exportButton.addEventListener("click", (e) => {
        const notes = JSON.parse(localStorage.getItem("notesData") || "[]");

        const jsonString = JSON.stringify(notes, null, 2);

        const blob = new Blob([jsonString], {
            type: "application/json"
    });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "historia_notatek.json";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // szukanie w notatkach

    searchForm.addEventListener("submit", (e) => {

        e.preventDefault();
        const phrase = searchInput.value.toLowerCase();

        const notes = JSON.parse(
            localStorage.getItem("notesData") || "[]"
        );

        const filteredNotes = notes.filter(note =>
            `${note.nickname} ${note.content} ${note.dateTime}`
                .toLowerCase()
                .includes(phrase)
        );

        displayNotes(filteredNotes);
    });


    //wyswietlanie notatek
    function displayNotes(notes){
        messages.innerHTML = "";

        notes.forEach(note => {
            const div = document.createElement("div");

            div.innerHTML = `
            <strong>${note.nickname}</strong>: 
            ${note.content}, 
            ${note.dateTime}
        `;

            messages.appendChild(div);
        });
    }

    // reconnect
    function connectWebSocket() {

        ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {

            console.log("Połączono");

            reconnectAttempts = 0;

            ws.send(JSON.stringify({
                type: "join",
                nickname
            }));
        };

        ws.onmessage = (event) => {
            // cały Twój obecny kod onmessage
        };

        ws.onclose = () => {

            console.log("Rozłączono");

            reconnect();
        };

        ws.onerror = (error) => {
            console.error("Błąd WebSocket:", error);
        };
    }
    function reconnect() {

        const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            MAX_DELAY
        );

        console.log(
            `Ponowna próba połączenia za ${delay / 1000} s`
        );

        reconnectAttempts++;

        setTimeout(() => {

            console.log("Próba reconnect...");

            connectWebSocket();

        }, delay);
    }

});

