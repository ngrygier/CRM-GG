// hamburger
const hamburger = document.querySelector(".hamburger");
const tabs = document.querySelector(".tabs");

hamburger.addEventListener("click", () => {
    tabs.classList.toggle("active");
});



// pokazywanie sie projektu w przypadku poprawnej weryfikacji
const joinBtn = document.getElementById("join");
const clientCard = document.getElementById("client-card");

//nie odswiezaj strony
joinBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //tworzenie websocketa po kliknieciu submit
    const nickname = document.getElementById("nickname").value;

    if (!nickname.trim()) {
        alert("Podaj nick");
        return;
    }

    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
        console.log("Połączono");

        ws.send(JSON.stringify({
            type: "join",
            nickname
        }));

        document.querySelector(".join-form").style.display = "none";
        document.getElementById("client-card").style.display = "block";
    };

    ws.onmessage = (event) => {
        console.log(event.data);
    };

    ws.onclose = () => {
        console.log("Rozłączono");
    };

    // pokazywanie kart po zalogowaniu


    clientCard.style.display = "block";
});

joinBtn.addEventListener("click", () => {
    clientCard.style.display = "block";
});

joinBtn.addEventListener("click", () => {
    document.querySelector(".join-form").style.display = "none";
    clientCard.style.display = "block";
});
