class WidokTworzenia {

    constructor() {

        this.przyciskiZakladek =
            document.querySelectorAll("[data-create-view]");

        this.sekcjaKlienta =
            document.querySelector("#clientSection");

        this.sekcjaOferty =
            document.querySelector("#offerSection");

        this.sekcjaProjektu =
            document.querySelector("#projectSection");

        this.typProduktu =
            document.querySelector("#productType");

        this.blatFields =
            document.querySelector("#countertopFields");

        this.parapetFields =
            document.querySelector("#windowSillFields");

        this.nagrobekFields =
            document.querySelector("#tombstoneFields");

        this.przyciskJson =
            document.querySelector("#downloadOfferJson");

        this.formularz =
            document.querySelector("#offerForm");
    }

    start() {

        this.podlaczZdarzenia();

    }

    podlaczZdarzenia() {

        this.typProduktu?.addEventListener(
            "change",
            () => this.zmienTypProduktu()
        );

        this.przyciskJson?.addEventListener(
            "click",
            () => this.pobierzJson()
        );

        this.przyciskiZakladek.forEach((przycisk) => {

            przycisk.addEventListener("click", () => {

                this.pokazZakladke(
                    przycisk.dataset.createView
                );

            });

        });

        const hamburgerBtn =
            document.querySelector("#hamburgerBtn");

        const tabs =
            document.querySelector(".tabs");

        if (hamburgerBtn && tabs) {

            hamburgerBtn.addEventListener("click", () => {

                tabs.classList.toggle("active");

            });

        }

        document.querySelectorAll("[data-page]")
            .forEach((przycisk) => {

                przycisk.addEventListener("click", () => {

                    window.location.href =
                        przycisk.dataset.page;

                });

            });
    }
    zmienTypProduktu() {

        this.blatFields.hidden = true;
        this.parapetFields.hidden = true;
        this.nagrobekFields.hidden = true;

        switch (this.typProduktu.value) {

            case "blat":
                this.blatFields.hidden = false;
                break;

            case "parapet":
                this.parapetFields.hidden = false;
                break;

            case "nagrobek":
                this.nagrobekFields.hidden = false;
                break;
        }
    }

    pokazZakladke(nazwaZakladki) {

        this.sekcjaKlienta.hidden = true;
        this.sekcjaOferty.hidden = true;
        this.sekcjaProjektu.hidden = true;

        if (nazwaZakladki === "client") {
            this.sekcjaKlienta.hidden = false;
        }

        if (nazwaZakladki === "offer") {
            this.sekcjaOferty.hidden = false;
        }

        if (nazwaZakladki === "project") {
            this.sekcjaProjektu.hidden = false;
        }

        this.przyciskiZakladek.forEach((przycisk) => {

            if (
                przycisk.dataset.createView ===
                nazwaZakladki
            ) {

                przycisk.classList.add(
                    "active-status"
                );

            } else {

                przycisk.classList.remove(
                    "active-status"
                );

            }

        });
    }

    pobierzJson() {

        const typProduktu =
            this.formularz.elements.productType.value;

        let produkt = "";
        let material = "";

        switch (typProduktu) {

            case "blat":

                produkt = "Blat kuchenny";

                material =
                    this.formularz.elements
                        .countertopMaterial.value;

                break;

            case "parapet":

                produkt = "Parapet";

                material =
                    this.formularz.elements
                        .windowSillMaterial.value;

                break;

            case "nagrobek":

                produkt = "Nagrobek";

                material =
                    this.formularz.elements
                        .tombstoneMaterial.value;

                break;
        }

        const oferta = {

            typ: "OFERTA",

            numerOferty: "OF/001/2026",

            klient: {

                imie:
                this.formularz.elements.firstName.value,

                nazwisko:
                this.formularz.elements.lastName.value,

                adres: "",

                telefon: ""

            },

            produkt,

            material,

            cenaBrutto: 0,

            notatki:
            this.formularz.elements.notes.value

        };

        const json = JSON.stringify(
            oferta,
            null,
            2
        );

        const blob = new Blob(
            [json],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "oferta.json";

        link.click();

        URL.revokeObjectURL(url);
    }
}

const widokTworzenia =
    new WidokTworzenia();

widokTworzenia.start();


// MODUŁ PROJEKTOWY


//projekt
const projectForm = document.getElementById("projectForm");

const projekty = [];

projectForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const nowyProjekt = {
        id: Date.now(),

        nazwaProjektu:
        document.getElementById("nazwaProjektu").value,

        klient:
        document.getElementById("klient").value,

        deadline:
        document.getElementById("deadline").value,

        opis:
        document.getElementById("opis").value,

        status: "Nowy"
    };

    projekty.push(nowyProjekt);

    console.log("Utworzono projekt:");
    console.log(nowyProjekt);

    console.log("Wszystkie projekty:");
    console.log(projekty);

    projectForm.reset();
});

const projectCreationType =
    document.getElementById("projectCreationType");

const newProjectFields =
    document.getElementById("newProjectFields");

const offerProjectFields =
    document.getElementById("offerProjectFields");

projectCreationType.addEventListener("change", () => {

    newProjectFields.hidden = true;
    offerProjectFields.hidden = true;

    if(projectCreationType.value === "new") {
        newProjectFields.hidden = false;
    }

    if(projectCreationType.value === "offer") {
        offerProjectFields.hidden = false;
    }
});

// tworzenie projektu od zera
const projectName = document.getElementById("nazwaProjektu");
const klientName = document.getElementById("klient");
const deadline = document.getElementById("deadline");
const opis = document.getElementById("opis");