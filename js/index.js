const hamburger =
    document.querySelector(".hamburger");

const tabs =
    document.querySelector(".tabs");

hamburger.addEventListener("click", () => {

    tabs.classList.toggle("active");

});
