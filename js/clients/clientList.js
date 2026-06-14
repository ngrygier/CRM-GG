import {
    loadClients
} from "./clientStore.js";

export class ClientList {

    constructor() {

        this.clientsContainer =
            document.querySelector(
                "#clientsContainer"
            );

        this.searchInput =
            document.querySelector(
                "#clientSearch"
            );
    }

    start() {

        this.renderClients();

        this.searchInput?.addEventListener(
            "input",
            () => {

                this.renderClients();
            }
        );
    }

    formatPhone(phone) {

        return phone.replace(
            /(\d{3})(\d{3})(\d{3})/,
            "$1 $2 $3"
        );
    }

    renderClients() {

        let clients =
            loadClients();

        const phrase =
            this.searchInput?.value
                ?.toLowerCase()
                ?.trim() || "";

        if (phrase) {

            clients = clients.filter(
                client =>

                    `${client.firstName} ${client.lastName}`
                        .toLowerCase()
                        .includes(phrase)

                    ||

                    client.email
                        ?.toLowerCase()
                        .includes(phrase)

                    ||

                    client.phone
                        ?.includes(phrase)

                    ||

                    client.city
                        ?.toLowerCase()
                        .includes(phrase)
            );
        }

        if (clients.length === 0) {

            this.clientsContainer.innerHTML = `
            <div class="table-card">
                <div class="info">
                    <h3>Brak wyników wyszukiwania</h3>
                </div>
            </div>
        `;

            return;
        }

        this.clientsContainer.innerHTML = `
    <div class="clients-table-wrapper">

            <table class="clients-table">

                <thead>
                    <tr>
                        <th>Klient</th>
                        <th>Telefon</th>
                        <th>Email</th>
                        <th>Miasto</th>
                        <th>Akcje</th>
                    </tr>
                </thead>

                <tbody>

                    ${clients.map(client => {

            const formattedPhone =
                this.formatPhone(client.phone);

            return `
                            <tr>

                                <td>
                                    ${client.firstName}
                                    ${client.lastName}
                                </td>

                                <td>${formattedPhone}</td>

                                <td>${client.email}</td>

                                <td>${client.city}</td>

                                <td>

                                    <button
                                        class="secondary-btn"
                                        onclick="
                                            localStorage.setItem(
                                                'selectedClientId',
                                                '${client.id}'
                                            );
                                    
                                            window.location.href =
                                                'client.html';
                                        ">
                                        Szczegóły
                                    </button>

                                </td>

                            </tr>
                        `;
        }).join('')}

                </tbody>

            </table>
    </div>
    `;
    }
}

const clientList =
    new ClientList();

clientList.start();