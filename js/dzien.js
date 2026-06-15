const params = new URLSearchParams(window.location.search);
const data = params.get("data");

document.getElementById("dzien").textContent = data;

const wydarzenia = {

};

document.getElementById("content").textContent =
    wydarzenia[data] || "Brak wydarzeń";


// przejscie do stron
document.querySelectorAll("[data-page]")
    .forEach((przycisk) => {

        przycisk.addEventListener("click", () => {

            window.location.href =
                przycisk.dataset.page;

        });

    });

const hamburger =
    document.querySelector(".hamburger");

const tabs =
    document.querySelector(".tabs");

hamburger.addEventListener("click", () => {

    tabs.classList.toggle("active");

});



class dzien{
    constructor(wydarzenia) {
        this.wydarzenia = [];
    }

}

