import {
    addProject,
    getProjectById,
    updateProject
} from "./projectStore.js";

export class ProjectCreate {

    constructor() {

        this.projectForm =
            document.querySelector("#projectForm");

        this.projectClient =
            document.querySelector("#projectClient");

        this.projectNumber =
            document.querySelector("#projectNumber");

        this.projectStatus =
            document.querySelector("#projectStatus");

        this.projectProductType =
            document.querySelector("#projectProductType");

        this.projectMaterial =
            document.querySelector("#projectMaterial");

        this.projectDeadline =
            document.querySelector("#projectDeadline");

        this.projectNotes =
            document.querySelector("#projectNotes");

        this.editingProjectId = null;

        this.submitButton =
            this.projectForm?.querySelector(
                'button[type="submit"]'
            );

        this.formTitle =
            document.querySelector(
                "#projectSection h1"
            );

        this.projectSubmitBtn =
            document.querySelector(
                "#projectSubmitBtn"
            );

        this.projectSecondaryBtn =
            document.querySelector(
                "#projectSecondaryBtn"
            );

        this.importProjectBtn =
            document.querySelector(
                "#importProjectBtn"
            );

        this.projectJsonFile =
            document.querySelector(
                "#projectJsonFile"
            );

        this.importedDocument =
            null;
    }

    start() {

        this.zaladujKlientow();

        this.sprawdzTrybEdycji();

        this.projectForm?.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                this.zapiszProjekt();
            }
        );

        this.projectSecondaryBtn?.addEventListener(
            "click",
            () => {

                if (
                    this.editingProjectId
                ) {

                    this.powrotDoProjektu();

                } else {

                    this.projectForm.reset();

                    this.zaladujKlientow();
                }
            }
        );

        this.importProjectBtn?.addEventListener(
            "click",
            () => {

                this.projectJsonFile.click();
            }
        );

        this.projectJsonFile?.addEventListener(
            "change",
            (event) => {

                this.importujJson(
                    event.target.files[0]
                );
            }
        );

    }

    zaladujKlientow() {

        const clients =
            JSON.parse(
                localStorage.getItem("clients")
            ) || [];

        this.projectClient.innerHTML =
            `
        <option value="">
            Wybierz klienta
        </option>
        `;

        clients.forEach(client => {

            const option =
                document.createElement("option");

            option.value =
                client.id;

            option.textContent =
                `${client.firstName} ${client.lastName}`;

            this.projectClient.appendChild(option);
        });

    }

    utworzObiektProjektu() {

        const now = new Date().toISOString();

        return {

            id: crypto.randomUUID(),

            title: `${this.projectProductType.value} - ${this.projectNumber.value}`,

            projectNumber: this.projectNumber.value,

            clientId: this.projectClient.value,

            status: this.projectStatus.value,

            tags: [],

            productType: this.projectProductType.value,

            material: this.projectMaterial.value,

            deadline: this.projectDeadline.value,

            notes: this.projectNotes.value,

            documents:
                this.importedDocument
                    ? [this.importedDocument]
                    : [],

            attachments: [],

            history: [{
                type: "created",
                date: now,
                description: "Utworzono projekt"
            }],

            createdAt: now,

            updatedAt: now
        };
    }

    zapiszProjekt() {

        if (
            !this.projectForm.checkValidity()
        ) {

            this.projectForm.reportValidity();

            return;
        }

        if (this.editingProjectId) {

            this.zapiszZmiany();

            return;
        }

        const project =
            this.utworzObiektProjektu();

        addProject(project);

        alert(
            "Projekt został zapisany"
        );

        this.projectForm.reset();

        this.zaladujKlientow();
    }

    sprawdzTrybEdycji() {

        const editId =
            new URLSearchParams(
                window.location.search
            ).get("edit");

        if (!editId) {
            return;
        }

        const project =
            getProjectById(editId);

        if (!project) {
            return;
        }

        this.editingProjectId =
            editId;

        this.wypelnijFormularz(project);
    }

    wypelnijFormularz(project) {

        this.projectClient.value =
            project.clientId;

        this.projectNumber.value =
            project.projectNumber;

        this.projectStatus.value =
            project.status;

        this.projectProductType.value =
            project.productType;

        this.projectMaterial.value =
            project.material;

        this.projectDeadline.value =
            project.deadline;

        this.projectNotes.value =
            project.notes;

        if (this.formTitle) {

            this.formTitle.textContent =
                "Edycja projektu";
        }

        if (this.submitButton) {

            this.submitButton.textContent =
                "Zapisz zmiany";
        }

        this.projectSecondaryBtn.textContent =
            "Powrót";
    }

    zapiszZmiany() {

        const project =
            getProjectById(
                this.editingProjectId
            );

        if (!project) {
            return;
        }

        project.projectNumber =
            this.projectNumber.value;

        project.clientId =
            this.projectClient.value;

        project.status =
            this.projectStatus.value;

        project.productType =
            this.projectProductType.value;

        project.material =
            this.projectMaterial.value;

        project.deadline =
            this.projectDeadline.value;

        project.notes =
            this.projectNotes.value;

        project.title =
            `${this.projectProductType.value} - ${this.projectNumber.value}`;

        project.updatedAt =
            new Date().toISOString();

        project.history.push({
            type: "updated",
            date: new Date().toISOString(),
            description: "Zaktualizowano projekt"
        });

        updateProject(project);

        alert(
            "Projekt został zaktualizowany"
        );

        localStorage.setItem(
            "selectedProjectId",
            project.id
        );

        window.location.href =
            "projects/projectPanel.html";
    }

    powrotDoProjektu() {

        window.location.href =
            `projects/project.html?id=${this.editingProjectId}`;
    }

    async importujJson(file) {

        if (!file) {
            return;
        }

        try {

            const text =
                await file.text();

            const data =
                JSON.parse(text);

            if (
                typeof data !== "object" ||
                !data.kind ||
                !data.version
            ) {

                alert(
                    "Niepoprawna struktura pliku"
                );

                return;
            }

            if (
                data.version !== 1
            ) {

                alert(
                    "Nieobsługiwana wersja pliku"
                );

                return;
            }

            switch (data.kind) {

                case "document":

                    this.obsluzImportDokumentu(
                        data
                    );

                    break;

                case "project":

                    this.obsluzImportProjektu(
                        data
                    );

                    break;

                default:

                    alert(
                        "Nieobsługiwany typ pliku"
                    );
            }

        } catch {

            alert(
                "Niepoprawny plik JSON"
            );
        }
    }

    wypelnijFormularzZJson(data) {

        const warunki =
            data.warunki || {};

        const produkt =
            (
                warunki.produkt || ""
            ).toLowerCase();

        const typy = [
            "nagrobek",
            "blat",
            "parapet"
        ];

        const znalezionyTyp =
            typy.find(typ =>
                produkt.includes(typ)
            );

        if (znalezionyTyp) {

            this.projectProductType.value =
                znalezionyTyp;
        }

        this.projectMaterial.value =
            warunki.material || "";

        this.projectNotes.value =
            warunki.notatki || "";

        const klient =
            data.strony?.klient;

        if (klient) {

            const clients =
                JSON.parse(
                    localStorage.getItem(
                        "clients"
                    )
                ) || [];

            const znaleziony =
                clients.find(client =>

                    client.firstName
                        .toLowerCase()
                        .trim() ===
                    klient.imie
                        .toLowerCase()
                        .trim()

                    &&

                    client.lastName
                        .toLowerCase()
                        .trim() ===
                    klient.nazwisko
                        .toLowerCase()
                        .trim()
                );

            if (znaleziony) {

                this.projectClient.value =
                    znaleziony.id;
            }
        }

        if (
            data.meta?.numer
        ) {

            this.projectNumber.value =
                data.meta.numer
                    .replace(
                        "OF/",
                        "PR/"
                    );
        }
    }

    obsluzImportDokumentu(data) {

        this.importedDocument =
            data;

        this.wypelnijFormularzZJson(
            data
        );

        alert(
            "Dokument zaimportowany"
        );
    }

    obsluzImportProjektu(data) {

        const project =
            data.project;

        if (!project) {

            alert(
                "Brak danych projektu"
            );

            return;
        }

        if (
            getProjectById(
                project.id
            )
        ) {

            alert(
                "Projekt już istnieje"
            );

            return;
        }

        addProject(project);

        alert(
            "Projekt został zaimportowany"
        );

        window.location.href =
            "projects/projectPanel.html";
    }
}

const utworzProjekt =
    new ProjectCreate();

utworzProjekt.start();