class ThemeManager {

    constructor() {

        this.themeButton =
            document.querySelector(
                "#themeToggle"
            );
    }

    start() {

        const savedTheme =
            localStorage.getItem(
                "theme"
            ) || "light";

        document.body.dataset.theme =
            savedTheme;

        this.updateButtonIcon(
            savedTheme
        );

        this.themeButton?.addEventListener(
            "click",
            () => {

                this.toggleTheme();
            }
        );
    }

    toggleTheme() {

        const currentTheme =
            document.body.dataset.theme;

        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        document.body.dataset.theme =
            newTheme;

        localStorage.setItem(
            "theme",
            newTheme
        );

        this.updateButtonIcon(
            newTheme
        );
    }

    updateButtonIcon(theme) {

        if (
            !this.themeButton
        ) {
            return;
        }

        this.themeButton.textContent =
            theme === "dark"
                ? "☀️"
                : "🌙";
    }
}

const themeManager =
    new ThemeManager();

themeManager.start();