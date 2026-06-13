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

        this.offerItemsBody =
            document.querySelector("#offerItemsBody");

        this.addOfferItemSelect =
            document.querySelector("#addOfferItemSelect");

        this.customOfferItem =
            document.querySelector("#customOfferItem");

        this.offerNumber =
            document.querySelector(
                "#offerNumber"
            );

        this.pozycjeProduktu = {

            blat: [
                "Transport",
                "Pomiar",
                "Montaż",
                "Otwór pod zlew",
                "Otwór pod płytę grzewczą",
                "Otwór pod baterię",
                "Obróbka krawędzi",
                "Impregnacja",
                "Wniesienie materiału"
            ],

            parapet: [
                "Transport",
                "Pomiar",
                "Montaż parapetu",
                "Obróbka boczna",
                "Impregnacja",
                "Demontaż starego parapetu",
                "Wniesienie materiału"
            ],

            nagrobek: [
                "Transport",
                "Montaż nagrobka",
                "Fundament",
                "Liternictwo",
                "Renowacja liter",
                "Zdjęcie na porcelanie",
                "Wazon",
                "Ławka",
                "Krzyż",
                "Impregnacja"
            ]
        };

        this.jednostkiPozycji = {

            "Transport": "usługa",

            "Pomiar": "usługa",

            "Montaż": "usługa",

            "Montaż parapetu": "usługa",

            "Montaż nagrobka": "usługa",

            "Impregnacja": "m²",

            "Wniesienie materiału": "usługa",

            "Otwór pod zlew": "szt.",

            "Otwór pod płytę grzewczą": "szt.",

            "Otwór pod baterię": "szt.",

            "Obróbka krawędzi": "mb",

            "Obróbka boczna": "mb",

            "Fundament": "kpl.",

            "Liternictwo": "szt.",

            "Renowacja liter": "szt.",

            "Zdjęcie na porcelanie": "szt.",

            "Wazon": "szt.",

            "Ławka": "szt.",

            "Krzyż": "szt."
        };

        this.offerJsonFile =
            document.querySelector(
                "#offerJsonFile"
            );

        this.importOfferButton =
            document.querySelector(
                "#importOfferButton"
            );

        this.saveOfferButton =
            document.querySelector(
                "#saveOfferButton"
            );

        this.jsonMessage =
            document.querySelector(
                "#jsonMessage"
            );
        this.projectForm =
            document.querySelector("#projectForm");

        this.projectClient =
            document.querySelector("#projectClient");

    }

    start() {

        this.podlaczZdarzenia();
        this.zmienTypProduktu();
        this.offerNumber.value =
            this.pobierzAktualnyNumerOferty();

    }

    podlaczZdarzenia() {

        this.typProduktu?.addEventListener(
            "change",
            () => this.zmienTypProduktu()
        );
        this.customOfferItem?.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    this.dodajWlasnaPozycje();
                }
            }
        );

        this.przyciskJson?.addEventListener(
            "click",
            () => this.pobierzJson()
        );

        this.saveOfferButton?.addEventListener(
            "click",
            () => this.zapiszOferte()
        );

        this.addOfferItemSelect?.addEventListener(
            "change",
            () => this.dodajPozycjeRealizacji()
        );

        this.przyciskiZakladek.forEach((przycisk) => {

            przycisk.addEventListener("click", () => {

                this.pokazZakladke(
                    przycisk.dataset.createView
                );

            });

        });

        this.importOfferButton?.addEventListener(
            "click",
            () => this.offerJsonFile.click()
        );

        this.offerJsonFile?.addEventListener(
            "change",
            (event) =>
                this.wczytajJson(event)
        );

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
        this.wyczyscPozycje();
        this.odswiezListePozycji();

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

        this.utworzPozycjeDomyslna();
    }

    wyczyscPozycje() {

        this.offerItemsBody.innerHTML = "";

    }

    utworzPozycjeDomyslna() {

        switch (this.typProduktu.value) {

            case "blat":

                this.dodajPozycje(
                    "Blat",
                    "m²",
                    1
                );

                break;

            case "parapet":

                this.dodajPozycje(
                    "Parapet",
                    "szt.",
                    1
                );

                break;

            case "nagrobek":

                this.dodajPozycje(
                    "Nagrobek",
                    "kpl.",
                    1
                );

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

    async wczytajJson(event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        try {

            const text =
                await file.text();

            const data =
                JSON.parse(text);

            this.walidujJson(data);

            this.wypelnijFormularz(data);

            this.pokazKomunikat(
                "Plik został poprawnie wczytany.",
                "success"
            );

        } catch (error) {

            this.pokazKomunikat(
                "Nieprawidłowy plik JSON: "
                + error.message,
                "error"
            );
        }
    }

    walidujJson(data) {

        if (
            data.version !== 1
        ) {
            throw new Error(
                "Nieobsługiwana wersja dokumentu."
            );
        }

        if (
            data.kind !== "document"
        ) {
            throw new Error(
                "Nieprawidłowy typ pliku."
            );
        }

        if (
            !data.meta ||
            !data.strony ||
            !Array.isArray(data.pozycje) ||
            !data.warunki ||
            !data.wartosc
        ) {
            throw new Error(
                "Brak wymaganych sekcji."
            );
        }
    }

    wypelnijFormularz(data) {

        this.formularz.elements
            .firstName.value =
            data.strony.klient.imie || "";

        this.formularz.elements
            .lastName.value =
            data.strony.klient.nazwisko || "";

        this.formularz.elements
            .notes.value =
            data.warunki.notatki || "";

        if (
            data.warunki.produkt ===
            "Blat kuchenny"
        ) {

            this.typProduktu.value =
                "blat";

        } else if (
            data.warunki.produkt ===
            "Parapet"
        ) {

            this.typProduktu.value =
                "parapet";

        } else if (
            data.warunki.produkt ===
            "Nagrobek"
        ) {

            this.typProduktu.value =
                "nagrobek";
        }

        this.zmienTypProduktu();

        const p =
            data.warunki.parametry || {};

        this.formularz.elements
            .offerValidUntil.value =
            data.warunki.waznoscOferty || "";

        if (this.typProduktu.value === "blat") {

            this.formularz.elements
                .countertopMaterial.value =
                data.warunki.material || "";

            this.formularz.elements
                .countertopThickness.value =
                p.grubosc || "";

            this.formularz.elements
                .countertopArea.value =
                p.powierzchnia || "";
        }

        if (this.typProduktu.value === "parapet") {

            this.formularz.elements
                .windowSillMaterial.value =
                data.warunki.material || "";

            this.formularz.elements
                .windowSillLength.value =
                p.dlugosc || "";

            this.formularz.elements
                .windowSillWidth.value =
                p.szerokosc || "";
        }

        if (this.typProduktu.value === "nagrobek") {

            this.formularz.elements
                .tombstoneMaterial.value =
                data.warunki.material || "";

            this.formularz.elements
                .tombstoneType.value =
                p.typ || "";

            this.formularz.elements
                .lettersColor.value =
                p.kolorLiter || "";
        }


        this.wyczyscPozycje();

        data.pozycje.forEach(
            pozycja => {

                this.dodajPozycje(
                    pozycja.nazwa,
                    pozycja.jednostka,
                    pozycja.ilosc
                );

                const row =
                    this.offerItemsBody
                        .lastElementChild;

                row.querySelector(".item-price")
                    .value =
                    pozycja.cenaNetto || 0;

                const vatSelect =
                    row.querySelector(".item-vat");

                const customVat =
                    row.querySelector(".custom-vat");

                const standardoweVat =
                    ["23", "8", "5", "0"];

                if (
                    standardoweVat.includes(
                        String(pozycja.vat)
                    )
                ) {

                    vatSelect.value =
                        String(pozycja.vat);

                } else {

                    vatSelect.value =
                        "inne";

                    customVat.hidden =
                        false;

                    customVat.value =
                        pozycja.vat;
                }
            }
        );

        this.przeliczPozycje();
    }

    pobierzAktualnyNumerOferty() {

        const numer =
            Number(
                localStorage.getItem(
                    "offerCounter"
                )
            ) || 1;

        return `OF/${String(numer)
            .padStart(3, "0")}/${new Date().getFullYear()}`;
    }

    pobierzKolejnyNumerOferty() {

        let numer =
            Number(
                localStorage.getItem(
                    "offerCounter"
                )
            ) || 1;

        localStorage.setItem(
            "offerCounter",
            numer + 1
        );

        return `OF/${String(numer)
            .padStart(3, "0")}/${new Date().getFullYear()}`;
    }

    utworzObiektOferty() {

        const typProduktu =
            this.formularz.elements.productType.value;

        let produkt = "";
        let material = "";
        let parametry = {};

        switch (typProduktu) {

            case "blat":

                produkt = "Blat kuchenny";

                material =
                    this.formularz.elements
                        .countertopMaterial.value;

                parametry = {

                    grubosc:
                    this.formularz.elements
                        .countertopThickness.value,

                    powierzchnia:
                    this.formularz.elements
                        .countertopArea.value

                };

                break;

            case "parapet":

                produkt = "Parapet";

                material =
                    this.formularz.elements
                        .windowSillMaterial.value;

                parametry = {

                    dlugosc:
                    this.formularz.elements
                        .windowSillLength.value,

                    szerokosc:
                    this.formularz.elements
                        .windowSillWidth.value

                };

                break;

            case "nagrobek":

                produkt = "Nagrobek";

                material =
                    this.formularz.elements
                        .tombstoneMaterial.value;

                parametry = {

                    typ:
                    this.formularz.elements
                        .tombstoneType.value,

                    kolorLiter:
                    this.formularz.elements
                        .lettersColor.value

                };

                break;
        }

        return {

            version: 1,

            kind: "document",

            meta: {

                id:
                    crypto.randomUUID(),

                typ: "OFERTA",

                numer:
                this.offerNumber.value,

                dataUtworzenia:
                    new Date().toISOString()

            },

            strony: {

                klient: {

                    imie:
                    this.formularz.elements
                        .firstName.value,

                    nazwisko:
                    this.formularz.elements
                        .lastName.value

                }

            },

            pozycje:
                this.pobierzPozycje(),

            warunki: {

                produkt,

                material,

                parametry,

                waznoscOferty:
                this.formularz.elements
                    .offerValidUntil.value,

                notatki:
                this.formularz.elements
                    .notes.value

            },

            wartosc: {

                cenaBrutto:
                    this.obliczSumeBrutto()

            }

        };

    }

    pobierzJson() {

        const oferta =
            this.utworzObiektOferty();


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

    pokazKomunikat(
        tekst,
        typ
    ) {

        this.jsonMessage.textContent =
            tekst;

        this.jsonMessage.className =
            typ;

        setTimeout(() => {

            this.jsonMessage.textContent =
                "";

            this.jsonMessage.className =
                "";

        }, 5000);
    }

    obliczSumeBrutto() {

        let suma = 0;

        this.offerItemsBody
            .querySelectorAll("tr")
            .forEach(row => {

                suma += Number(
                    row.querySelector(
                        ".item-brutto"
                    ).textContent
                ) || 0;
            });

        return Number(
            suma.toFixed(2)
        );
    }

    dodajWlasnaPozycje() {

        const nazwa =
            this.customOfferItem.value.trim();

        if (!nazwa) {
            return;
        }

        this.dodajPozycje(
            nazwa,
            "usługa",
            1
        );

        this.customOfferItem.value = "";

        this.customOfferItem.hidden = true;

        this.addOfferItemSelect.value = "";
    }

    dodajPozycje(
        nazwa = "",
        jednostka = "szt.",
        ilosc = 1
    ) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
        <td>
            <input
                class="item-name"
                value="${nazwa}">
        </td>

        <td class="item-unit">
        
            ${jednostka}
        
        </td>

        <td>

            <input
                type="number"
                min="1"
                value="${ilosc}"
                class="item-qty">

        </td>

        <td>

            <input
                type="number"
                min="0"
                step="0.01"
                value="0"
                class="item-price">

        </td>

        <td>

            <select class="item-vat">
    
                <option value="23">23%</option>
                <option value="8">8%</option>
                <option value="5">5%</option>
                <option value="0">0%</option>
            
                <option value="inne">
                    Inne
                </option>
            
            </select>
            
            <input
                type="number"
                min="0"
                step="0.01"
                class="custom-vat"
                placeholder="VAT %"
                hidden>

        </td>

        <td class="item-netto">
            0.00
        </td>

        <td class="item-brutto">
            0.00
        </td>

        <td>

            <button
                type="button"
                class="remove-item">

                ✖

            </button>

        </td>
    `;

        this.offerItemsBody.appendChild(row);

        row.addEventListener(
            "input",
            () => this.przeliczPozycje()
        );

        row.querySelector(".item-vat")
            .addEventListener(
                "change",
                () => {

                    const select =
                        row.querySelector(".item-vat");

                    const customVat =
                        row.querySelector(".custom-vat");

                    if (select.value === "inne") {

                        customVat.hidden = false;

                        customVat.focus();

                    } else {

                        customVat.hidden = true;

                        customVat.value = "";
                    }

                    this.przeliczPozycje();
                }
            );

        row.querySelector(".remove-item")
            .addEventListener(
                "click",
                () => {

                    row.remove();

                    this.przeliczPozycje();
                }
            );

        this.przeliczPozycje();
    }

    przeliczPozycje() {

        this.offerItemsBody
            .querySelectorAll("tr")
            .forEach(row => {

                const ilosc =
                    Number(
                        row.querySelector(".item-qty").value
                    ) || 0;

                const cena =
                    Number(
                        row.querySelector(".item-price").value
                    ) || 0;

                let vat;

                const vatSelect =
                    row.querySelector(".item-vat");

                if (vatSelect.value === "inne") {

                    vat =
                        Number(
                            row.querySelector(".custom-vat")
                                .value
                        ) || 0;

                } else {

                    vat =
                        Number(vatSelect.value);

                }

                const netto =
                    ilosc * cena;

                const brutto =
                    netto +
                    (netto * vat / 100);

                row.querySelector(".item-netto")
                    .textContent =
                    netto.toFixed(2);

                row.querySelector(".item-brutto")
                    .textContent =
                    brutto.toFixed(2);

            });

    }

    pobierzPozycje() {

        return [
            ...this.offerItemsBody
                .querySelectorAll("tr")
        ].map(row => ({

            nazwa:
            row.querySelector(".item-name")
                .value,

            jednostka:
                row.querySelector(".item-unit")
                    .textContent
                    .trim(),

            ilosc:
                Number(
                    row.querySelector(".item-qty")
                        .value
                ),

            cenaNetto:
                Number(
                    row.querySelector(".item-price")
                        .value
                ),

            vat: (() => {

                const vatSelect =
                    row.querySelector(".item-vat");

                if (vatSelect.value === "inne") {

                    return Number(
                        row.querySelector(".custom-vat")
                            .value
                    ) || 0;
                }

                return Number(vatSelect.value);

            })()

        }));
    }

    odswiezListePozycji() {

        const select =
            this.addOfferItemSelect;

        select.innerHTML = `
        <option value="">
            Dodaj pozycję realizacji...
        </option>
    `;

        const pozycje =
            this.pozycjeProduktu[
                this.typProduktu.value
                ] || [];

        pozycje.forEach(pozycja => {

            const option =
                document.createElement("option");

            option.value = pozycja;

            option.textContent = pozycja;

            select.appendChild(option);
        });

        const inne =
            document.createElement("option");

        inne.value = "inne";

        inne.textContent =
            "Wpisz własne";

        select.appendChild(inne);
    }

    dodajPozycjeRealizacji() {

        const nazwa =
            this.addOfferItemSelect.value;

        if (!nazwa) {
            return;
        }

        if (nazwa === "inne") {

            this.customOfferItem.hidden = false;

            this.customOfferItem.focus();

            return;
        } else {

            const jednostka =
                this.jednostkiPozycji[nazwa]
                || "szt.";

            this.dodajPozycje(
                nazwa,
                jednostka,
                1
            );
        }

        this.addOfferItemSelect.value = "";
    }

    zapiszOferte() {

        if (
            !this.formularz.checkValidity()
        ) {

            this.formularz.reportValidity();

            return;
        }

        const oferta =
            this.utworzObiektOferty();

        oferta.meta.numer =
            this.pobierzKolejnyNumerOferty();

        const oferty =
            JSON.parse(
                localStorage.getItem(
                    "oferty"
                ) || "[]"
            );

        this.offerNumber.value =
            this.pobierzAktualnyNumerOferty();

        oferty.push(oferta);

        localStorage.setItem(
            "oferty",
            JSON.stringify(oferty)
        );

        this.pokazKomunikat(
            "Oferta została zapisana.",
            "success"
        );
    }


}

const widokTworzenia =
    new WidokTworzenia();

widokTworzenia.start();