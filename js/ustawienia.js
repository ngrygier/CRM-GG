class Ustawienia {


constructor() {
    this.przyciskMotywu =
        document.querySelector("#themeToggle");
}

async start() {

    try {

        this.wczytajUstawienia();

        this.podlaczZdarzenia();

    } catch (error) {

        console.error(
            "Nie udało się uruchomić ustawień.",
            error
        );

    }

}

wczytajUstawienia() {

    const motyw =
        localStorage.getItem("theme") || "light";

    if (motyw === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }

    this.aktualizujTekstPrzycisku();

}

podlaczZdarzenia() {

    this.przyciskMotywu?.addEventListener(
        "click",
        () => this.przelaczMotyw()
    );

    document
        .querySelectorAll("[data-page]")
        .forEach((przycisk) => {

            przycisk.addEventListener(
                "click",
                () => {

                    window.location.href =
                        przycisk.dataset.page;

                }
            );

        });

    const hamburgerBtn =
        document.querySelector("#hamburgerBtn");

    const tabs =
        document.querySelector(".tabs");

    if (hamburgerBtn && tabs) {

        hamburgerBtn.addEventListener(
            "click",
            () => {

                tabs.classList.toggle(
                    "active"
                );

            }
        );

    }

}

aktualizujTekstPrzycisku() {

    if (!this.przyciskMotywu) {
        return;
    }

    const ciemny =
        document.body.classList.contains(
            "dark-theme"
        );

    this.przyciskMotywu.textContent =
        ciemny
            ? "Przełącz na jasny"
            : "Przełącz na ciemny";

}

przelaczMotyw() {

    document.body.classList.toggle(
        "dark-theme"
    );

    const nowyMotyw =
        document.body.classList.contains(
            "dark-theme"
        )
            ? "dark"
            : "light";

    localStorage.setItem(
        "theme",
        nowyMotyw
    );

    this.aktualizujTekstPrzycisku();

}


}

const ustawienia = new Ustawienia();

ustawienia.start();
