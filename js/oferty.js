
const motyw =
    localStorage.getItem("theme");

if (motyw === "dark") {

    document.body.classList.add(
        "dark-theme"
    );

}

class WidokOfert {

    constructor() {

        this.offersBody =
            document.querySelector(
                "#offersBody"
            );

        this.offerDetails =
            document.querySelector(
                "#offerDetails"
            );

        this.searchClient =
            document.querySelector(
                "#searchClient"
            );

        this.searchNumber =
            document.querySelector(
                "#searchNumber"
            );

        this.searchDate =
            document.querySelector(
                "#searchDate"
            );

    }

    start() {

        this.podlaczFiltry();
        this.wyswietlOferty();

    }

    podlaczFiltry() {

        this.searchClient
            ?.addEventListener(
                "input",
                () =>
                    this.wyswietlOferty()
            );

        this.searchNumber
            ?.addEventListener(
                "input",
                () =>
                    this.wyswietlOferty()
            );

        this.searchDate
            ?.addEventListener(
                "change",
                () =>
                    this.wyswietlOferty()
            );
    }

    wyswietlOferty() {

        let oferty =
            JSON.parse(
                localStorage.getItem(
                    "oferty"
                ) || "[]"
            );

        const klient =
            this.searchClient?.value
                .toLowerCase() || "";

        const numer =
            this.searchNumber?.value
                .toLowerCase() || "";

        const data =
            this.searchDate?.value || "";

        oferty =
            oferty.filter(
                oferta => {

                    const klientTekst =

                        `${oferta.strony.klient.imie}
                 ${oferta.strony.klient.nazwisko}`
                            .toLowerCase();

                    const numerOferty =

                        oferta.meta.numer
                            .toLowerCase();

                    const dataOferty =

                        oferta.meta
                            .dataUtworzenia
                            .slice(0, 10);

                    return (

                        klientTekst.includes(
                            klient
                        )

                        &&

                        numerOferty.includes(
                            numer
                        )

                        &&

                        (
                            !data
                            ||
                            dataOferty === data
                        )
                    );

                }
            );

        this.offersBody.innerHTML = "";

        oferty.forEach(
            (oferta, index) => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${oferta.meta.numer}
                    </td>

                    <td>
                        ${oferta.strony.klient.imie}
                        ${oferta.strony.klient.nazwisko}
                    </td>

                    <td>
                        ${oferta.warunki.produkt}
                    </td>

                    <td>
                        ${new Date(
                    oferta.meta.dataUtworzenia
                ).toLocaleDateString()}
                    </td>

                    <td>

                        <button
                            class="show-offer-btn"
                            data-action="preview"
                            data-index="${index}">
                            Otwórz
                        </button>
                    
                    
                        <button
                            class="delete-offer-btn"
                            data-action="delete"
                            data-index="${index}">
                            Usuń
                        </button>
                    
                    </td>
                `;

                this.offersBody.appendChild(row);

            }
        );

        document
            .querySelectorAll(
                "[data-action]"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                btn.dataset.index
                            );

                        const action =
                            btn.dataset.action;

                        if (
                            action === "preview"
                        ) {

                            this.pokazOferte(
                                index
                            );
                        }

                        if (
                            action === "delete"
                        ) {

                            this.usunOferte(
                                index
                            );
                        }

                    }
                );

            });

    }

    pokazOferte(index) {

        const oferty =
            JSON.parse(
                localStorage.getItem(
                    "oferty"
                ) || "[]"
            );

        localStorage.setItem(
            "otwartaOferta",
            JSON.stringify(
                oferty[index]
            )
        );

        window.location.href =
            "oferta.html";
    }

    usunOferte(index) {

        if (
            !confirm(
                "Usunąć ofertę?"
            )
        ) {
            return;
        }

        const oferty =
            JSON.parse(
                localStorage.getItem(
                    "oferty"
                ) || "[]"
            );

        oferty.splice(
            index,
            1
        );

        localStorage.setItem(
            "oferty",
            JSON.stringify(oferty)
        );

        this.wyswietlOferty();

        this.offerDetails.hidden =
            true;
    }


}

const widokOfert =
    new WidokOfert();

widokOfert.start();

const hamburgerBtn =
    document.querySelector(
        "#hamburgerBtn"
    );

const mobileTabs =
    document.querySelector(
        ".tabs"
    );

hamburgerBtn?.addEventListener(
    "click",
    () => {

        mobileTabs.classList.toggle(
            "active"
        );

    }
);

document.querySelectorAll("[data-page]").forEach((przycisk) => {
    przycisk.addEventListener("click", () => {
        window.location.href = przycisk.dataset.page;
    });
});