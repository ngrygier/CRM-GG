const params = new URLSearchParams(window.location.search);
const data = params.get("data");

document.getElementById("dzien").textContent = data;

const wydarzenia = {

};

document.getElementById("content").textContent =
    wydarzenia[data] || "Brak wydarzeń";
