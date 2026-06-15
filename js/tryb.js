const motyw =
    localStorage.getItem("theme");

if (motyw === "dark") {
    document.body.classList.add("dark-theme");
}