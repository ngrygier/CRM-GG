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
                telefon: formularz.elements.clientPhone.value.trim()
            },
            wykonawca: {
                nazwa: formularz.elements.companyName.value.trim(),
                adres: formularz.elements.companyAddress.value.trim(),
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

        if (umowa.klient.telefon !== "" && umowa.klient.telefon.length < 7) {
            bledy.push("Telefon klienta powinien mieć minimum 7 znaków.");
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

        return bledy;
    }
}

class WidokUmow {
    constructor() {
        this.formularz = document.querySelector("#contractForm");
        this.podgladUmowy = document.querySelector("#contractPreview");
        this.przyciskJson = document.querySelector("#downloadJson");
        this.przyciskPdf = document.querySelector("#exportPdf");

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
    }

    async start() {
        try {
            this.umowy = await this.wczytajPrzykladoweUmowy();
            this.ustawDzisiejszaDate();
            this.podlaczZdarzenia();
            this.wyswietlListeUmow(this.umowy);
            this.odswiezPodglad();
        } catch (error) {
            this.pokazKomunikat(this.komunikatListy, "Nie udało się wczytać umów.");
        }
    }

    async wczytajPrzykladoweUmowy() {
        return Promise.resolve([
            {
                numerUmowy: "UM/001/2026",
                klient: "Jan Kowalski",
                kontrahent: "Kamieniarstwo GRANIT Sp. z o.o.",
                data: "2026-05-31",
                przedmiot: "blat kuchenny z kamienia naturalnego"
            },
            {
                numerUmowy: "UM/002/2026",
                klient: "Anna Nowak",
                kontrahent: "Kamieniarstwo GRANIT Sp. z o.o.",
                data: "2026-06-02",
                przedmiot: "schody z marmuru"
            },
            {
                numerUmowy: "UM/003/2026",
                klient: "Marta Wiśniewska",
                kontrahent: "Kamieniarstwo GRANIT Sp. z o.o.",
                data: "2026-06-10",
                przedmiot: "parapety z konglomeratu"
            },
            {
                numerUmowy: "UM/004/2026",
                klient: "Tomasz Lewandowski",
                kontrahent: "Kamieniarstwo GRANIT Sp. z o.o.",
                data: "2026-06-18",
                przedmiot: "nagrobek granitowy"
            }
        ]);
    }

    podlaczZdarzenia() {
        this.przyciskiZakladek.forEach((przycisk) => {
            przycisk.addEventListener("click", () => {
                this.pokazZakladke(przycisk.dataset.contractView);
            });
        });

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
            }
        });

        this.formularz.addEventListener("input", () => this.odswiezPodglad());
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
        const tekst = this.filtrKlienta.value.trim().toLowerCase();
        const dataOd = this.filtrDatyOd.value;
        const dataDo = this.filtrDatyDo.value;

        const wynik = this.umowy.filter((umowa) => {
            const klientIKontrahent = `${umowa.klient} ${umowa.kontrahent}`.toLowerCase();
            const pasujeTekst = tekst === "" || klientIKontrahent.includes(tekst);
            const pasujeDataOd = dataOd === "" || umowa.data >= dataOd;
            const pasujeDataDo = dataDo === "" || umowa.data <= dataDo;

            return pasujeTekst && pasujeDataOd && pasujeDataDo;
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

        umowy.forEach((umowa) => {
            const karta = document.createElement("article");
            karta.className = "table-card contract-list-item";
            karta.dataset.contractNumber = umowa.numerUmowy;

            const info = document.createElement("div");
            info.className = "info";

            info.innerHTML = `
                <h3>${this.zabezpieczTekst(umowa.numerUmowy)}</h3>
                <p>Klient: ${this.zabezpieczTekst(umowa.klient)}</p>
                <p>Kontrahent: ${this.zabezpieczTekst(umowa.kontrahent)}</p>
                <p>Data: ${this.formatujDate(umowa.data)}</p>
                <p>Przedmiot: ${this.zabezpieczTekst(umowa.przedmiot)}</p>
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
        this.ukryjKomunikat(this.komunikatFormularza);
    }

    async importujOferte(plik) {

        try {

            const tekst = await plik.text();

            const oferta = JSON.parse(tekst);

            if (oferta.typ !== "OFERTA") {
                throw new Error("Niepoprawny format pliku oferty.");
            }

            if (!oferta.klient) {
                throw new Error("Brak danych klienta w ofercie.");
            }

            this.wypelnijFormularzZOfery(oferta);

            this.odswiezPodglad();

            this.pokazKomunikat(
                this.komunikatFormularza,
                "Oferta została wczytana."
            );

        } catch (error) {

            this.pokazKomunikat(
                this.komunikatFormularza,
                error.message || "Nie udało się odczytać pliku oferty."
            );

        }
    }


    wypelnijFormularzZOfery(oferta) {

        this.formularz.elements.clientName.value =
            `${oferta.klient.imie || ""} ${oferta.klient.nazwisko || ""}`.trim();

        this.formularz.elements.clientAddress.value =
            oferta.klient.adres || "";

        this.formularz.elements.clientPhone.value =
            oferta.klient.telefon || "";

        this.formularz.elements.product.value =
            oferta.produkt || "";

        this.formularz.elements.material.value =
            oferta.material || "";

        this.formularz.elements.grossPrice.value =
            oferta.cenaBrutto || 0;

        this.formularz.elements.notes.value =
            oferta.notatki || "";
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

            const adresCss = new URL("style/style.style", window.location.href).href;

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
        const plik = new Blob([zawartosc], { type: typPliku });
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
                        <p>NIP: ${this.zabezpieczTekst(umowa.wykonawca.nip)}</p>
                    </div>

                    <div>
                        <h3>Zamawiający</h3>
                        <p><strong>${this.zabezpieczTekst(umowa.klient.imieNazwisko)}</strong></p>
                        <p>${this.zabezpieczTekst(umowa.klient.adres)}</p>
                        <p>Telefon: ${this.zabezpieczTekst(umowa.klient.telefon)}</p>
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
                    <h3>§ 5. Postanowienia końcowe</h3>
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
}

const widokUmow = new WidokUmow();
widokUmow.start().catch(() => {
    const komunikat = document.querySelector("#contractsMessage");
    komunikat.textContent = "Wystąpił błąd podczas uruchamiania zakładki umów.";
    komunikat.hidden = false;
});
