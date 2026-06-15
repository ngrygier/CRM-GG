

// zmienne
let ws;
let nickname = "";
let shouldReconnect = false;

let reconnectAttempts = 0;
const MAX_DELAY = 30000;

// stałe

const projectId = localStorage.getItem("selectedProjectId");

const notesStorageKey = `notesData_${projectId}`;

const hamburger = document.querySelector(".hamburger");
const tabs = document.querySelector(".tabs");

const joinBtn = document.getElementById("join");
const projectDetailsSection = document.getElementById("projectDetailsSection");

const messages = document.querySelector(".messages");
const formularzDolaczenia = document.getElementById("formularzDoDolaczenia");

const exportButton = document.getElementById("export-json");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-notes");

const messageInput = document.getElementById("messageInput");

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
if (hamburger && tabs) {
    hamburger.addEventListener("click", () => {
        tabs.classList.toggle("active");
    });
}

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

            formularzDolaczenia.style.display = "none";
            document.getElementById("projectDetailsSection").style.display = "block";
            window.projectDetails.start();

            // ładowanie historii
            const history = JSON.parse(localStorage.getItem(notesStorageKey) || "[]");

            history.forEach(data => {

                const div = document.createElement("div");

                div.dataset.noteId = data.id;

                div.innerHTML = `
        <strong>${data.nickname}</strong>:
        ${data.content},
        ${data.dateTime}
    `;

                if(
                    data.nickname === nickname ||
                    nickname.toLowerCase() === "admin"
                ){

                    const deleteBtn =
                        document.createElement("button");

                    deleteBtn.textContent = "Usuń";

                    deleteBtn.addEventListener("click", () => {

                        ws.send(JSON.stringify({
                            type: "deleteNote",
                            noteId: data.id
                        }));

                    });

                    div.appendChild(deleteBtn);
                }

                messages.appendChild(div);
            });
            const attachmentHistory = JSON.parse(
                localStorage.getItem(`attachments_${projectId}`) || "[]"
            );

            attachmentHistory.forEach(data => {

                const div = document.createElement("div");

                if(data.fileName.match(/\.(jpg|jpeg|png|gif)$/i)){

                    div.innerHTML = `
            <strong>${data.nickname}</strong><br>

            <img
                src="http://localhost:8080/uploads/${data.fileName}"
                style="max-width:300px">
        `;
                } else {

                    div.innerHTML = `
            <strong>${data.nickname}</strong><br>

            <a
                href="http://localhost:8080/uploads/${data.fileName}"
                target="_blank">
                ${data.fileName}
            </a>
        `;
                }

                messages.appendChild(div);
            });
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // obsługa błędu - nick zajęcty
            if(data.type === "error"){
                alert(data.message);
                ws.close();
                projectDetailsSection.style.display = "none"
                formularzDolaczenia.style.display = "flex";

                return;
            }
            if(data.type === "attachment"){
                const div =
                    document.createElement("div");

                if(data.fileName.match(/\.(jpg|jpeg|png|gif)$/i)){

                    div.innerHTML = `
                <strong>${data.nickname}</strong><br>

                <img
                    src="http://localhost:8080/uploads/${data.fileName}"
                    style="max-width:300px">
            `;
                }
                messages.appendChild(div);
                saveAttachment(data);

            }
            if(data.type === "deleteNote"){

                deleteNoteFromStorage(data.noteId);

                const noteElement =
                    document.querySelector(
                        `[data-note-id="${data.noteId}"]`
                    );

                if(noteElement){
                    noteElement.remove();
                }

                return;
            }

            if(data.type !== "note"){
                console.log("dołączył użytkownik o nicku " + data.nickname)
                return;
            }

            const div = document.createElement("div");

            div.dataset.noteId = data.id;

            // drukowanie danych (konsola w przeglądarce)
            console.log(
                "uzytkownik o nicku " +
                data.nickname +
                " napisal: " +
                data.content +
                ". Godz: " +
                data.dateTime
            );

            // zapis do localStorage
            saveMessage(data);

            // pokazywanie w html
            div.innerHTML = `
            <strong>${data.nickname}</strong>:
           ${data.content},
           ${data.dateTime}
            `;

            if(data.nickname === nickname || nickname.toLowerCase() === "admin"){

                const deleteBtn =
                    document.createElement("button");

                deleteBtn.textContent = "Usuń";

                deleteBtn.addEventListener("click", () => {

                    ws.send(JSON.stringify({
                        type: "deleteNote",
                        noteId: data.id
                    }));

                });

                div.appendChild(deleteBtn);
            }

            messages.appendChild(div);
        };

        // pokazywanie kart po zalogowaniu
        projectDetailsSection.style.display = "block";

        // rozłączenie
        ws.onclose = () => {
            showWebSocketState();

            if (shouldReconnect) {
                reconnect();
            }
        };

        joinBtn.addEventListener("click", () => {
            projectDetailsSection.style.display = "block";
        });

        joinBtn.addEventListener("click", () => {
            document.querySelector(".formularzDolaczenia").style.display = "none";
            projectDetailsSection.style.display = "block";
        });

        // blokowanie przeladowania strony po wypisaniu formularza
        document.getElementById("notes-input").addEventListener("submit", (e)=>{
            e.preventDefault();

            if (ws.readyState === WebSocket.OPEN) {

                ws.send(JSON.stringify({
                    id: crypto.randomUUID(),
                    type: "note",
                    content: messageInput.value,
                    nickname,
                    dateTime: new Date().toLocaleString("pl-PL")
                }));
                document.getElementById("messageInput").value = "";

            } else {

                alert("Brak połączenia z serwerem");
                showWebSocketState();
            }
        });

    }

    // funkcja zapisywania wiadomości za pomocą localStorage
    function saveMessage(noteData){

        const notes =
            JSON.parse(
                localStorage.getItem(notesStorageKey) || "[]"
            );


        notes.push(noteData);

        localStorage.setItem(
            notesStorageKey,
            JSON.stringify(notes)
        );
    }

    function deleteNoteFromStorage(noteId){

        const notes = JSON.parse(
            localStorage.getItem(notesStorageKey) || "[]"
        );

        const updatedNotes =
            notes.filter(note => note.id !== noteId);

        localStorage.setItem(
            notesStorageKey,
            JSON.stringify(updatedNotes)
        );
    }


    // eksport historii notatek do JSON
    exportButton.addEventListener("click", (e) => {
        const notes = JSON.parse(localStorage.getItem(notesStorageKey) || "[]");

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

        const notes = JSON.parse(localStorage.getItem(notesStorageKey) || "[]");

        const filteredNotes = notes.filter(note =>
            `${note.nickname} ${note.content} ${note.dateTime}`
                .toLowerCase()
                .includes(phrase)
        );
        document.getElementById("search-notes").value = "";

        displayNotes(filteredNotes);
    });


    //wyswietlanie notatek
    function displayNotes(notes){
        messages.innerHTML = "";

        notes.forEach(note => {
            const div = document.createElement("div");
            div.dataset.noteId = data.id;

            //przycisk usuniecia dla autora
            if(note.nickname === nickname || nickname.toLowerCase() === "admin"){

                const deleteBtn =
                    document.createElement("button");

                deleteBtn.textContent = "Usuń";

                deleteBtn.addEventListener("click", () => {

                    ws.send(JSON.stringify({
                        type: "deleteNote",
                        noteId: data.id
                    }));

                });

                div.appendChild(deleteBtn);
            }

            div.innerHTML = `
            <strong>${note.nickname}</strong>: 
            ${note.content}, 
            ${note.dateTime}
        `;

            messages.appendChild(div);
        });
    }

    // dołączanie plików i załączników

    const fileUploadForm =
        document.getElementById("fileUploadForm");

    fileUploadForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const file =
                document.getElementById("attachment")
                    .files[0];

            const formData =
                new FormData();

            formData.append(
                "attachment",
                file
            );

            const response =
                await fetch(
                    "http://localhost:8080/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            const result =
                await response.json();

            if (!result.success) {

                alert(result.message);
                return;
            }

            // dodawanie zalacznika
            ws.send(JSON.stringify({

                type: "attachment",

                nickname,

                fileName: result.fileName,

                dateTime: new Date().toLocaleString("pl-PL")
            }));
            document.getElementById("attachment").value = "";
        }
    );
    function saveAttachment(data){

        const attachments =
            JSON.parse(
                localStorage.getItem(
                    `attachments_${projectId}`
                ) || "[]"
            );

        attachments.push(data);

        localStorage.setItem(
            `attachments_${projectId}`,
            JSON.stringify(attachments)
        );
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
