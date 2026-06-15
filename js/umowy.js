class Umowa {

    constructor(dane) {
        this.numerUmowy = dane.numerUmowy;
        this.dataZawarcia = dane.dataZawarcia;
        this.miejscowosc = dane.miejscowosc;
        this.klient = dane.klient;
        this.wykonawca = dane.wykonawca;
        this.zlecenie = dane.zlecenie;
    }

    static zFormularza(formularz) {
        const cenaBrutto = Number(formularz.elements.grossPrice.value || 0);
        const zaliczka = Number(formularz.elements.deposit.value || 0);

        return new Umowa({
            numerUmowy: formularz.elements.contractNumber.value.trim(),
            dataZawarcia: formularz.elements.contractDate.value,
            miejscowosc: formularz.elements.city.value.trim(),
            klient: {
                imieNazwisko: formularz.elements.clientName.value.trim(),
                adres: formularz.elements.clientAddress.value.trim(),
                telefon: formularz.elements.clientPhone.value.trim(),
                email: formularz.elements.clientEmail.value.trim(),
                nip: formularz.elements.clientTaxId.value.trim()
            },
            wykonawca: {
                nazwa: formularz.elements.companyName.value.trim(),
                adres: formularz.elements.companyAddress.value.trim(),
                email: formularz.elements.companyEmail.value.trim(),
                nip: formularz.elements.companyTaxId.value.trim()
            },
            zlecenie: {
                przedmiot: formularz.elements.product.value.trim(),
                material: formularz.elements.material.value.trim(),
                zakresPrac: formularz.elements.workScope.value.trim(),
                terminRealizacji: formularz.elements.deadline.value,
                cenaBrutto: cenaBrutto,
                zaliczka: zaliczka,
                doZaplaty: cenaBrutto - zaliczka,
                gwarancja: Number(formularz.elements.warrantyMonths.value || 0),
                dodatkoweUstalenia: formularz.elements.notes.value.trim()
            }
        });
    }

    toJSON() {
        return {
            numerUmowy: this.numerUmowy,
            dataZawarcia: this.dataZawarcia,
            miejscowosc: this.miejscowosc,
            klient: this.klient,
            wykonawca: this.wykonawca,
            zlecenie: this.zlecenie
        };
    }
}

class WalidatorUmowy {
    sprawdz(umowa) {
        const bledy = [];

        if (umowa.numerUmowy.length < 3) {
            bledy.push("Numer umowy musi mieć minimum 3 znaki.");
        }

        if (umowa.miejscowosc.length < 2) {
            bledy.push("Wpisz miejscowość.");
        }

        if (umowa.klient.imieNazwisko.length < 3) {
            bledy.push("Wpisz imię i nazwisko klienta.");
        }

        if (umowa.klient.adres.length < 5) {
            bledy.push("Adres klienta jest za krótki.");
        }

        if (
            umowa.klient.telefon !== "" &&
            !/^\d{9}$/.test(umowa.klient.telefon)
        ) {
            bledy.push("Telefon klienta powinien zawierać 9 cyfr.");
        }

        if (umowa.wykonawca.nazwa.length < 3) {
            bledy.push("Wpisz nazwę wykonawcy.");
        }

        if (umowa.zlecenie.przedmiot.length < 3) {
            bledy.push("Wpisz przedmiot umowy.");
        }

        if (umowa.zlecenie.material.length < 3) {
            bledy.push("Wpisz materiał.");
        }

        if (!umowa.dataZawarcia) {
            bledy.push("Wybierz datę zawarcia umowy.");
        }

        if (!umowa.zlecenie.terminRealizacji) {
            bledy.push("Wybierz termin realizacji.");
        }

        if (umowa.dataZawarcia && umowa.zlecenie.terminRealizacji) {
            if (umowa.zlecenie.terminRealizacji < umowa.dataZawarcia) {
                bledy.push("Termin realizacji nie może być wcześniejszy niż data zawarcia umowy.");
            }
        }

        if (umowa.zlecenie.cenaBrutto <= 0) {
            bledy.push("Cena brutto musi być większa od 0.");
        }

        if (umowa.zlecenie.zaliczka < 0) {
            bledy.push("Zaliczka nie może być ujemna.");
        }

        if (umowa.zlecenie.zaliczka > umowa.zlecenie.cenaBrutto) {
            bledy.push("Zaliczka nie może być większa niż cena brutto.");
        }

        if (
            umowa.klient.email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(umowa.klient.email)
        ) {
            bledy.push("Podaj poprawny e-mail klienta.");
        }

        if (
            umowa.wykonawca.email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(umowa.wykonawca.email)
        ) {
            bledy.push("Podaj poprawny e-mail wykonawcy.");
        }

        if (
            umowa.klient.nip !== "" &&
            !/^\d{10}$/.test(umowa.klient.nip)
        ) {
            bledy.push("NIP klienta powinien zawierać 10 cyfr.");
        }

        if (
            umowa.wykonawca.nip !== "" &&
            !/^\d{10}$/.test(umowa.wykonawca.nip)
        ) {
            bledy.push("NIP wykonawcy powinien zawierać 10 cyfr.");
        }

        if (umowa.zlecenie.gwarancja < 0) {
            bledy.push("Okres gwarancji nie może być ujemny.");
        }

        return bledy;
    }
}

class WidokUmow {
    constructor() {
        this.formularz = document.querySelector("#contractForm");
        this.podgladUmowy = document.querySelector("#contractPreview");
        this.przyciskJson = document.querySelector("#downloadJson");
        this.przyciskPdf = document.querySelector("#exportPdf");
        this.przyciskZapisu =
            document.querySelector("#saveContract");

        this.przyciskImportu =
            document.querySelector("#importOfferButton");

        this.plikOferty =
            document.querySelector("#offerJsonFile");


        this.komunikatFormularza = document.querySelector("#formMessage");

        this.przyciskiZakladek = document.querySelectorAll("[data-contract-view]");
        this.zakladkaPrzegladaj = document.querySelector("#contractsBrowser");
        this.zakladkaGenerator = document.querySelector("#contractGenerator");

        this.filtrKlienta = document.querySelector("#contractClientFilter");
        this.filtrDatyOd = document.querySelector("#contractDateFrom");
        this.filtrDatyDo = document.querySelector("#contractDateTo");
        this.przyciskSzukaj = document.querySelector("#contractSearchButton");
        this.listaUmow = document.querySelector("#contractsList");
        this.komunikatListy = document.querySelector("#contractsMessage");

        this.walidator = new WalidatorUmowy();
        this.umowy = [];

        this.timerPodgladu = null;
        this.kluczSzkicu = "szkicUmowy";
    }

    async start() {

        try {

            this.umowy =
                this.pobierzUmowyZLocalStorage();

            this.ustawDzisiejszaDate();

            this.wczytajSzkic();

            this.podlaczZdarzenia();

            window.addEventListener(
                "hashchange",
                () => {

                    const widok =
                        location.hash.replace(
                            "#",
                            ""
                        );

                    if (widok) {

                        this.pokazZakladke(
                            widok
                        );

                    }

                }
            );

            const startowyWidok =
                location.hash.replace(
                    "#",
                    ""
                );

            if (startowyWidok) {

                this.pokazZakladke(
                    startowyWidok
                );

            } else {

                location.hash =
                    "browse";

            }

            this.wyswietlListeUmow(
                this.umowy
            );

            this.odswiezPodglad();

        } catch (error) {

            this.pokazKomunikat(
                this.komunikatListy,
                "Nie udało się wczytać umów."
            );

        }

    }


    podlaczZdarzenia() {
        this.przyciskiZakladek.forEach((przycisk) => {
            przycisk.addEventListener("click", () => {

                location.hash =
                    przycisk.dataset.contractView;

            });
        });

        this.przyciskZapisu.addEventListener(
            "click",
            () => this.zapiszUmowe()
        );

        document.querySelectorAll("[data-page]").forEach((przycisk) => {
            przycisk.addEventListener("click", () => {
                window.location.href = przycisk.dataset.page;
            });
        });

        this.filtrKlienta.addEventListener("input", () => this.filtrujUmowy());
        this.filtrDatyOd.addEventListener("input", () => this.filtrujUmowy());
        this.filtrDatyDo.addEventListener("input", () => this.filtrujUmowy());
        this.przyciskSzukaj.addEventListener("click", () => this.filtrujUmowy());

        this.listaUmow.addEventListener("click", (event) => {
            const kartaUmowy = event.target.closest(".contract-list-item");

            if (kartaUmowy) {

                this.zaznaczUmowe(kartaUmowy);

                const id =
                    Number(kartaUmowy.dataset.contractId);

                this.pokazUmowe(id);
            }
        });

        this.formularz.addEventListener(
            "input",
            () => {

                this.ukryjKomunikat(
                    this.komunikatFormularza
                );


                this.zapiszSzkic();

                clearTimeout(
                    this.timerPodgladu
                );

                this.timerPodgladu =
                    setTimeout(
                        () => {
                            this.odswiezPodglad();
                        },
                        300
                    );

            }
        );

        document.addEventListener(
            "keydown",
            (event) => {

                // Ctrl + S = zapisz umowę
                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "s"
                ) {

                    event.preventDefault();

                    this.zapiszUmowe();
                }

                // Esc = zamknij komunikaty
                if (
                    event.key === "Escape"
                ) {

                    this.ukryjKomunikat(
                        this.komunikatFormularza
                    );

                    this.ukryjKomunikat(
                        this.komunikatListy
                    );
                }

                // / = przejdź do wyszukiwarki
                if (
                    event.key === "/" &&
                    document.activeElement.tagName !== "INPUT" &&
                    document.activeElement.tagName !== "TEXTAREA"
                ) {

                    event.preventDefault();

                    this.filtrKlienta.focus();
                }

            }
        );

        this.przyciskJson.addEventListener("click", () => this.eksportujJson());
        this.przyciskPdf.addEventListener("click", () => this.eksportujPdf());

        this.przyciskImportu.addEventListener(
            "click",
            () => this.plikOferty.click()
        );

        this.plikOferty.addEventListener(
            "change",
            (event) => {
                const plik = event.target.files[0];

                if (plik) {
                    this.importujOferte(plik);
                }
            }
        );

        const hamburgerBtn = document.querySelector("#hamburgerBtn");
        const tabs = document.querySelector(".tabs");

        if (hamburgerBtn && tabs) {
            hamburgerBtn.addEventListener("click", () => {
                tabs.classList.toggle("active");
            });
        }
    }

    pokazZakladke(nazwaZakladki) {
        const czyGenerator = nazwaZakladki === "generator";

        this.zakladkaPrzegladaj.hidden = czyGenerator;
        this.zakladkaGenerator.hidden = !czyGenerator;

        this.przyciskiZakladek.forEach((przycisk) => {
            if (przycisk.dataset.contractView === nazwaZakladki) {
                przycisk.classList.add("active-status");
            } else {
                przycisk.classList.remove("active-status");
            }
        });
    }

    filtrujUmowy() {

        const tekst =
            this.filtrKlienta.value.trim().toLowerCase();

        const dataOd =
            this.filtrDatyOd.value;

        const dataDo =
            this.filtrDatyDo.value;

        const wynik = this.umowy.filter((umowa) => {

            const klient =
                umowa.klient.imieNazwisko.toLowerCase();

            const pasujeTekst =
                tekst === "" || klient.includes(tekst);

            const pasujeDataOd =
                dataOd === "" ||
                umowa.dataZawarcia >= dataOd;

            const pasujeDataDo =
                dataDo === "" ||
                umowa.dataZawarcia <= dataDo;

            return (
                pasujeTekst &&
                pasujeDataOd &&
                pasujeDataDo
            );
        });

        this.wyswietlListeUmow(wynik);
    }

    wyswietlListeUmow(umowy) {
        this.listaUmow.innerHTML = "";

        if (umowy.length === 0) {
            this.pokazKomunikat(this.komunikatListy, "Nie znaleziono umów dla podanych filtrów.");
            return;
        }

        this.ukryjKomunikat(this.komunikatListy);

        umowy.forEach((umowa, index) => {
            const karta = document.createElement("article");
            karta.className = "table-card contract-list-item";
            karta.dataset.contractId = index;

            const info = document.createElement("div");
            info.className = "info";

            info.innerHTML = `
                <h3>${this.zabezpieczTekst(umowa.numerUmowy)}</h3>
                <p>Klient: ${this.zabezpieczTekst(umowa.klient.imieNazwisko)}</p>
                <p>Data: ${this.formatujDate(umowa.dataZawarcia)}</p>
                <p>Przedmiot: ${this.zabezpieczTekst(umowa.zlecenie.przedmiot)}</p>
            `;

            karta.appendChild(info);
            this.listaUmow.appendChild(karta);
        });
    }

    zaznaczUmowe(kartaUmowy) {
        document.querySelectorAll(".contract-list-item").forEach((karta) => {
            karta.classList.remove("contract-list-item-active");
        });

        kartaUmowy.classList.add("contract-list-item-active");
    }

    ustawDzisiejszaDate() {
        const dzisiaj = new Date();
        const termin = new Date();

        termin.setDate(termin.getDate() + 30);

        this.formularz.elements.contractDate.value = dzisiaj.toISOString().slice(0, 10);
        this.formularz.elements.deadline.value = termin.toISOString().slice(0, 10);
    }

    odswiezPodglad() {
        const umowa = Umowa.zFormularza(this.formularz);
        this.podgladUmowy.innerHTML = this.stworzHtmlUmowy(umowa);
    }

    pokazUmowe(id) {

        const umowa = this.umowy[id];

        if (!umowa) {
            return;
        }

        const okno = window.open("", "_blank");

        if (!okno) {
            return;
        }

        const adresCss =
            new URL("../style/umowyStyle.css", window.location.href).href;

        okno.document.write(`
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <title>${this.zabezpieczTekst(umowa.numerUmowy)}</title>
            <link rel="stylesheet" href="${adresCss}">
        </head>
        <body class="print-page">
            ${this.stworzHtmlUmowy(umowa)}
        </body>
        </html>
    `);

        okno.document.close();
    }

    zapiszUmowe() {

        const umowa = Umowa.zFormularza(this.formularz);

        const bledy = this.walidator.sprawdz(umowa);

        if (bledy.length > 0) {
            this.pokazKomunikat(
                this.komunikatFormularza,
                bledy.join(" ")
            );
            return;
        }

        const zapisaneUmowy =
            JSON.parse(localStorage.getItem("umowy")) || [];

        zapisaneUmowy.push(umowa.toJSON());

        localStorage.setItem(
            "umowy",
            JSON.stringify(zapisaneUmowy)
        );

        this.pokazKomunikat(
            this.komunikatFormularza,
            "Umowa została zapisana."
        );

        this.umowy = this.pobierzUmowyZLocalStorage();

        this.wyswietlListeUmow(this.umowy);
    }

    pobierzUmowyZLocalStorage() {
        return JSON.parse(
            localStorage.getItem("umowy")
        ) || [];
    }

    async importujOferte(plik) {

        try {

            const tekst = await plik.text();

            const oferta = JSON.parse(tekst);

            if (oferta.meta?.typ !== "OFERTA") {
                throw new Error("Niepoprawny format pliku oferty.");
            }

            if (!oferta.strony?.klient) {
                throw new Error("Brak danych klienta w ofercie.");
            }

            this.wypelnijFormularzZOfery(oferta);

            this.odswiezPodglad();

            this.pokazKomunikat(
                this.komunikatFormularza,
                "Oferta została wczytana."
            );

        } catch (error) {

            console.error(error);

            if (error instanceof SyntaxError) {

                this.pokazKomunikat(
                    this.komunikatFormularza,
                    "Wybrany plik JSON jest uszkodzony lub ma nieprawidłowy format."
                );

            } else {

                this.pokazKomunikat(
                    this.komunikatFormularza,
                    error.message
                );

            }

        }
    }


    wypelnijFormularzZOfery(oferta) {

        const klient = oferta.strony?.klient || {};
        const warunki = oferta.warunki || {};
        const parametry = warunki.parametry || {};

        this.formularz.elements.clientName.value =
            `${klient.imie || ""} ${klient.nazwisko || ""}`.trim();

        this.formularz.elements.product.value =
            warunki.produkt || "";

        this.formularz.elements.material.value =
            warunki.material || "";

        this.formularz.elements.grossPrice.value =
            oferta.wartosc?.cenaBrutto || 0;

        this.formularz.elements.notes.value =
            warunki.notatki || "";

        let zakresPrac = "";

        switch (warunki.produkt) {

            case "Blat kuchenny":
                zakresPrac =
                    `Wykonanie i montaż blatu kuchennego.\n` +
                    `Grubość: ${parametry.grubosc || "-"} mm\n` +
                    `Powierzchnia: ${parametry.powierzchnia || "-"} m²`;
                break;

            case "Parapet":
                zakresPrac =
                    "Wykonanie i montaż parapetu.";
                break;

            case "Nagrobek":
                zakresPrac =
                    "Wykonanie i montaż nagrobka.";
                break;

            default:
                zakresPrac = warunki.produkt || "";
        }

        this.formularz.elements.workScope.value = zakresPrac;
    }

    eksportujJson() {
        try {
            const umowa = Umowa.zFormularza(this.formularz);
            const bledy = this.walidator.sprawdz(umowa);

            if (bledy.length > 0) {
                this.pokazKomunikat(this.komunikatFormularza, bledy.join(" "));
                return;
            }

            const numerDoNazwyPliku = umowa.numerUmowy.replaceAll("/", "-");
            const tekstJson = JSON.stringify(umowa.toJSON(), null, 2);

            this.pobierzPlik(
                `umowa-${numerDoNazwyPliku}.json`,
                "application/json;charset=utf-8",
                tekstJson
            );
        } catch (error) {
            this.pokazKomunikat(this.komunikatFormularza, "Nie udało się wygenerować pliku JSON.");
        }
    }

    eksportujPdf() {
        try {
            const umowa = Umowa.zFormularza(this.formularz);
            const bledy = this.walidator.sprawdz(umowa);

            if (bledy.length > 0) {
                this.pokazKomunikat(this.komunikatFormularza, bledy.join(" "));
                return;
            }

            const oknoDruku = window.open("", "_blank");

            if (!oknoDruku) {
                this.pokazKomunikat(this.komunikatFormularza, "Przeglądarka zablokowała okno wydruku.");
                return;
            }

            const adresCss =
                new URL("../style/umowyStyle.css", window.location.href).href;

            oknoDruku.document.write(`
                <!DOCTYPE html>
                <html lang="pl">
                <head>
                    <meta charset="UTF-8">
                    <title>Umowa ${this.zabezpieczTekst(umowa.numerUmowy)}</title>
                    <link rel="stylesheet" href="${adresCss}">
                </head>
                <body class="print-page">
                    ${this.stworzHtmlUmowy(umowa)}
                    <script>
                        window.addEventListener("load", () => {
                            window.print();
                        });
                    </script>
                </body>
                </html>
            `);

            oknoDruku.document.close();
        } catch (error) {
            this.pokazKomunikat(this.komunikatFormularza, "Nie udało się przygotować pliku PDF.");
        }
    }

    pobierzPlik(nazwaPliku, typPliku, zawartosc) {
        const plik = new Blob([zawartosc], {type: typPliku});
        const adresPliku = URL.createObjectURL(plik);
        const link = document.createElement("a");

        link.href = adresPliku;
        link.download = nazwaPliku;
        link.click();

        setTimeout(() => URL.revokeObjectURL(adresPliku), 1000);
    }

    stworzHtmlUmowy(umowa) {
        const zlecenie = umowa.zlecenie;

        return `
            <div class="contract-document">
                <header class="contract-header">
                    <p>Umowa nr ${this.zabezpieczTekst(umowa.numerUmowy)}</p>
                    <h2>Umowa o wykonanie prac kamieniarskich</h2>
                    <span>${this.zabezpieczTekst(umowa.miejscowosc)}, dnia ${this.formatujDate(umowa.dataZawarcia)}</span>
                </header>

                <section class="contract-parties">
                    <div>
                        <h3>Wykonawca</h3>
                        <p><strong>${this.zabezpieczTekst(umowa.wykonawca.nazwa)}</strong></p>
                        <p>${this.zabezpieczTekst(umowa.wykonawca.adres)}</p>
                    
                        ${umowa.wykonawca.nip
            ? `<p>NIP: ${this.zabezpieczTekst(umowa.wykonawca.nip)}</p>`
            : ""}
                    
                        <p>E-mail: ${this.zabezpieczTekst(umowa.wykonawca.email)}</p>
                    </div>
                    
                    <div>
                        <h3>Zamawiający</h3>
                        <p><strong>${this.zabezpieczTekst(umowa.klient.imieNazwisko)}</strong></p>
                        <p>${this.zabezpieczTekst(umowa.klient.adres)}</p>
                        <p>Telefon: ${this.zabezpieczTekst(umowa.klient.telefon)}</p>
                        <p>E-mail: ${this.zabezpieczTekst(umowa.klient.email)}</p>
                    
                        ${umowa.klient.nip
            ? `<p>NIP: ${this.zabezpieczTekst(umowa.klient.nip)}</p>`
            : ""}
                    </div>
                </section>

                <section>
                    <h3>§ 1. Przedmiot umowy</h3>
                    <p>Wykonawca zobowiązuje się wykonać: <strong>${this.zabezpieczTekst(zlecenie.przedmiot)}</strong>.</p>
                    <p>Materiał: <strong>${this.zabezpieczTekst(zlecenie.material)}</strong>.</p>
                    <p>Zakres prac obejmuje: ${this.zabezpieczTekst(zlecenie.zakresPrac)}.</p>
                </section>

                <section>
                    <h3>§ 2. Termin realizacji</h3>
                    <p>Termin wykonania prac: <strong>${this.formatujDate(zlecenie.terminRealizacji)}</strong>.</p>
                </section>

                <section>
                    <h3>§ 3. Wynagrodzenie</h3>
                    <p>Całkowite wynagrodzenie brutto wynosi <strong>${this.formatujKwote(zlecenie.cenaBrutto)}</strong>.</p>
                    <p>Zaliczka: <strong>${this.formatujKwote(zlecenie.zaliczka)}</strong>. Do zapłaty: <strong>${this.formatujKwote(zlecenie.doZaplaty)}</strong>.</p>
                </section>

                <section>
                    <h3>§ 4. Ustalenia dodatkowe</h3>
                    <p>${this.zabezpieczTekst(zlecenie.dodatkoweUstalenia)}</p>
                </section>
                
                <section>
                    <h3>§ 5. Gwarancja</h3>
                    <p>
                        Wykonawca udziela gwarancji na wykonane prace
                        na okres
                        <strong>${zlecenie.gwarancja} miesięcy</strong>.
                    </p>
                </section>

                <section>
                    <h3>§ 6. Postanowienia końcowe</h3>
                    <p>Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.</p>
                </section>

                <footer class="signature-row">
                    <div>
                        <span></span>
                        <p>Podpis Wykonawcy</p>
                    </div>
                    <div>
                        <span></span>
                        <p>Podpis Zamawiającego</p>
                    </div>
                </footer>
            </div>
        `;
    }

    formatujKwote(kwota) {
        return new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN"
        }).format(kwota);
    }

    formatujDate(data) {
        if (!data) {
            return "";
        }

        return new Intl.DateTimeFormat("pl-PL").format(new Date(data));
    }

    zabezpieczTekst(tekst) {
        return String(tekst)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    pokazKomunikat(element, tekst) {
        element.textContent = tekst;
        element.hidden = false;
    }

    ukryjKomunikat(element) {
        element.textContent = "";
        element.hidden = true;
    }

    zapiszSzkic() {

        const dane =
            Object.fromEntries(
                new FormData(
                    this.formularz
                )
            );

        localStorage.setItem(
            this.kluczSzkicu,
            JSON.stringify(dane)
        );
    }

    wczytajSzkic() {

        const szkic =
            JSON.parse(
                localStorage.getItem(
                    this.kluczSzkicu
                )
            );

        if (!szkic) {
            return;
        }

        Object.entries(szkic)
            .forEach(
                ([nazwa, wartosc]) => {

                    const pole =
                        this.formularz.elements[
                            nazwa
                            ];

                    if (pole) {
                        pole.value = wartosc;
                    }

                }
            );

        this.odswiezPodglad();
    }
}


const widokUmow = new WidokUmow();
widokUmow.start().catch(() => {
    const komunikat = document.querySelector("#contractsMessage");
    komunikat.textContent = "Wystąpił błąd podczas uruchamiania zakładki umów.";
    komunikat.hidden = false;
});
