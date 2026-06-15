const oferta =
    JSON.parse(
        localStorage.getItem(
            "otwartaOferta"
        )
    );

const offerDetails =
    document.querySelector(
        "#offerDetails"
    );

if (!oferta) {

    offerDetails.innerHTML = `
        <h2>
            Nie znaleziono oferty
        </h2>
    `;

} else {

    let parametryHtml = "";

    const p =
        oferta.warunki.parametry || {};

    switch (
        oferta.warunki.produkt
        ) {

        case "Blat kuchenny":

            parametryHtml = `

                <div class="preview-card">

                    <h3>
                        Parametry blatu
                    </h3>

                    <p>
                        Grubość:
                        ${p.grubosc || "-"}
                    </p>

                    <p>
                        Powierzchnia:
                        ${p.powierzchnia || "-"}
                    </p>

                </div>

            `;

            break;

        case "Parapet":

            parametryHtml = `

                <div class="preview-card">

                    <h3>
                        Parametry parapetu
                    </h3>

                    <p>
                        Długość:
                        ${p.dlugosc || "-"}
                    </p>

                    <p>
                        Szerokość:
                        ${p.szerokosc || "-"}
                    </p>

                </div>

            `;

            break;

        case "Nagrobek":

            parametryHtml = `

                <div class="preview-card">

                    <h3>
                        Parametry nagrobka
                    </h3>

                    <p>
                        Typ:
                        ${p.typ || "-"}
                    </p>

                    <p>
                        Kolor liter:
                        ${p.kolorLiter || "-"}
                    </p>

                </div>

            `;

            break;
    }

    let pozycjeHtml = "";

    oferta.pozycje.forEach(
        pozycja => {

            pozycjeHtml += `

                <tr>

                    <td>
                        ${pozycja.nazwa}
                    </td>

                    <td>
                        ${pozycja.jednostka}
                    </td>

                    <td>
                        ${pozycja.ilosc}
                    </td>

                    <td>
                        ${pozycja.cenaNetto}
                    </td>

                    <td>
                        ${pozycja.vat}%
                    </td>

                </tr>

            `;
        }
    );

    offerDetails.innerHTML = `

        <h2>
            ${oferta.meta.numer}
        </h2>

        <div class="preview-grid">

            <div class="preview-card">

                <h3>
                    Klient
                </h3>

                <p>
                    ${oferta.strony.klient.imie}
                    ${oferta.strony.klient.nazwisko}
                </p>

            </div>

            <div class="preview-card">

                <h3>
                    Produkt
                </h3>

                <p>
                    ${oferta.warunki.produkt}
                </p>

            </div>

            <div class="preview-card">

                <h3>
                    Materiał
                </h3>

                <p>
                    ${oferta.warunki.material}
                </p>

            </div>

            <div class="preview-card">

                <h3>
                    Ważność oferty
                </h3>

                <p>
                    ${oferta.warunki.waznoscOferty}
                </p>

            </div>

            ${parametryHtml}

        </div>

        <h3>
            Pozycje wyceny
        </h3>

        <table id="offersTable">

            <thead>

                <tr>

                    <th>Nazwa</th>
                    <th>Jednostka</th>
                    <th>Ilość</th>
                    <th>Cena netto</th>
                    <th>VAT</th>

                </tr>

            </thead>

            <tbody>

                ${pozycjeHtml}

            </tbody>

        </table>

        <div
            class="preview-card"
            style="margin-top:20px;">

            <h3>
                Wartość końcowa
            </h3>

            <p>

                ${oferta.wartosc.cenaBrutto}
                zł

            </p>

        </div>

        <div
            class="preview-card"
            style="margin-top:20px;">

            <h3>
                Notatki
            </h3>

            <p>

                ${oferta.warunki.notatki}

            </p>

        </div>

    `;
}