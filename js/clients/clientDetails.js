import {
    loadClients,
    deleteClient
} from "./clientStore.js";

class ClientDetails {

    constructor() {

        this.clientName =
            document.querySelector(
                "#clientName"
            );

        this.clientPhone =
            document.querySelector(
                "#clientPhone"
            );

        this.clientEmail =
            document.querySelector(
                "#clientEmail"
            );

        this.clientCity =
            document.querySelector(
                "#clientCity"
            );

        this.clientPostalCode =
            document.querySelector(
                "#clientPostalCode"
            );

        this.clientAddress =
            document.querySelector(
                "#clientAddress"
            );

        this.clientNotes =
            document.querySelector(
                "#clientNotes"
            );

        this.clientProjects =
            document.querySelector(
                "#clientProjects"
            );

        this.backBtn =
            document.querySelector(
                "#backBtn"
            );

        this.editClientBtn =
            document.querySelector(
                "#editClientBtn"
            );

        this.deleteClientBtn =
            document.querySelector(
                "#deleteClientBtn"
            );

        this.currentClient =
            null;
    }

    start() {

        this.renderClient();

        this.backBtn?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "clientPanel.html";
            }
        );

        this.editClientBtn?.addEventListener(
            "click",
            () => {

                this.editClient();
            }
        );

        this.deleteClientBtn?.addEventListener(
            "click",
            () => {

                this.deleteCurrentClient();
            }
        );
    }

    renderClient() {

        const selectedId =
            localStorage.getItem(
                "selectedClientId"
            );

        this.currentClient =
            loadClients().find(
                client =>
                    String(client.id)
                    === String(selectedId)
            );

        const client =
            this.currentClient;

        if (!client) {

            this.clientName.textContent =
                "Nie znaleziono klienta";

            return;
        }

        this.clientName.textContent =
            `${client.firstName} ${client.lastName}`;

        this.clientPhone.textContent =
            this.formatPhone(
                client.phone
            );

        this.clientEmail.textContent =
            client.email || "-";

        this.clientCity.textContent =
            client.city || "-";

        this.clientPostalCode.textContent =
            client.postalCode || "-";

        this.clientAddress.textContent =
            client.address || "-";

        this.clientNotes.textContent =
            client.notes || "-";

        this.renderProjects(
            client.id
        );
    }

    renderProjects(clientId) {

        const projects =
            JSON.parse(
                localStorage.getItem(
                    "projects"
                )
            ) || [];

        const clientProjects =
            projects.filter(
                project =>
                    String(project.clientId)
                    === String(clientId)
            );

        if (!clientProjects.length) {

            this.clientProjects.textContent =
                "Brak projektów";

            return;
        }

        this.clientProjects.innerHTML =
            clientProjects.map(
                project => `
                <div>
                    ${project.projectNumber}
                    - 
                    ${project.productType}
                </div>
            `
            ).join("");
    }

    formatPhone(phone) {

        if (!phone) {
            return "-";
        }

        return phone.replace(
            /(\d{3})(\d{3})(\d{3})/,
            "$1 $2 $3"
        );
    }

    editClient() {

        const selectedId =
            localStorage.getItem(
                "selectedClientId"
            );

        window.location.href =
            `../utworz.html?view=client&edit=${selectedId}`;
    }

    deleteCurrentClient() {

        const confirmed =
            confirm(
                "Czy na pewno usunąć klienta?"
            );

        if (!confirmed) {
            return;
        }

        const selectedId =
            localStorage.getItem(
                "selectedClientId"
            );

        deleteClient(
            selectedId
        );

        localStorage.removeItem(
            "selectedClientId"
        );

        window.location.href =
            "clientPanel.html";
    }
}

const clientDetails =
    new ClientDetails();

clientDetails.start();