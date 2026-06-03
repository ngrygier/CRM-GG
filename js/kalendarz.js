const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();

const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
];

function renderCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = lastDay.getDate();

    monthYear.textContent = `${months[month]} ${year}`;

    calendar.innerHTML = "";

    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty-day");
        calendar.appendChild(empty);
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {

        const dayElement = document.createElement("div");
        dayElement.classList.add("calendar-day");
        dayElement.textContent = day;

        dayElement.onclick = function() {
            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(day + 1).padStart(2, "0");

            window.location.href = `dzien.html?data=${year}-${monthStr}-${dayStr}`;
        }

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        calendar.appendChild(dayElement);
    }
}

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

// hamburger menu
const hamburger =
    document.querySelector(".hamburger");

const tabs =
    document.querySelector(".tabs");

hamburger.addEventListener("click", () => {

    tabs.classList.toggle("active");

});
