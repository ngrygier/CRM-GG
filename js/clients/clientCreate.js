import {
    addClient,
    getClientById,
    updateClient
}
    from "./clientStore.js";
export class ClientCreate {
    constructor() {
        this.clientForm = document.querySelector("#clientForm");
        this.submitBtn = document.querySelector("#submitBtn");
        this.secondaryBtn = document.querySelector("#secondaryActionBtn");
        this.editingClientId = null;
        this.formTitle = document.querySelector("#formTitle");
    }
    start() {
        this.sprawdzTrybEdycji();
        this.clientForm?.addEventListener("submit",
            (event) => {
                event.preventDefault();
                this.zapiszKlienta();
            });
        this.secondaryBtn?.addEventListener("click",
            () => {
                this.clientForm.reset();
            });
    }
    sprawdzTrybEdycji() {
        const editId = new URLSearchParams(window.location.search).get("edit");
        if (!editId) {
            return;
        }
        const client = getClientById(editId);
        if (!client) {
            return;
        }
        this.editingClientId = editId;
        this.wypelnijFormularz(client);
    }
    wypelnijFormularz(client) {
        this.clientForm.firstName.value = client.firstName;
        this.clientForm.lastName.value = client.lastName;
        this.clientForm.phone.value = client.phone;
        this.clientForm.email.value = client.email;
        this.clientForm.city.value = client.city;
        this.clientForm.postalCode.value = client.postalCode;
        this.clientForm.address.value = client.address;
        this.clientForm.notes.value = client.notes;
        this.formTitle.textContent = "Edycja klienta";
        this.submitBtn.textContent = "Zapisz zmiany";
        this.secondaryBtn.textContent = "Powrót";
        this.secondaryBtn.addEventListener("click",
            () => {
                window.location.href = "clients/client.html";
            });
    }
    zapiszKlienta() {
        if (!this.clientForm.checkValidity()) {
            this.clientForm.reportValidity();
            return;
        }
        const phone = this.clientForm.phone.value.replace(/\s/g, "");
        const client = {
            id: this.editingClientId || Date.now(),
            firstName: this.clientForm.firstName.value.trim(),
            lastName: this.clientForm.lastName.value.trim(),
            phone,
            email: this.clientForm.email.value.trim().toLowerCase(),
            city: this.clientForm.city.value.trim(),
            postalCode: this.clientForm.postalCode.value.trim(),
            address: this.clientForm.address.value.trim(),
            notes: this.clientForm.notes.value.trim()
        };
        if (this.editingClientId) {
            updateClient(client);
            localStorage.setItem("selectedClientId", client.id);
            window.location.href = "clients/client.html";
            return;
        }
        addClient(client);
        alert("Klient został zapisany");
        this.clientForm.reset();
    }
}
const clientCreate = new ClientCreate();
clientCreate.start();