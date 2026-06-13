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

        this.projectAttachmentsInput =
            document.querySelector(
                "#projectAttachmentsInput"
            );

        this.projectAttachmentsPreview =
            document.querySelector(
                "#projectAttachmentsPreview"
            );

        this.attachments = [];
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

        this.projectAttachmentsInput?.addEventListener(
            "change",
            (event) => {

                this.handleAttachments(
                    event.target.files
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

            attachments:
            this.attachments,

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

        this.attachments =
            project.attachments || [];

        this.renderAttachmentsPreview();
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

        project.attachments =
            this.attachments;

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

    async handleAttachments(files) {

        const maxSize =
            5 * 1024 * 1024;

        for (const file of files) {

            const allowedTypes = [

                "image/jpeg",

                "image/png",

                "image/webp",

                "application/pdf",

                "application/json"
            ];

            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    `${file.name} ma nieobsługiwany typ pliku`
                );

                continue;
            }

            if (
                file.size > maxSize
            ) {

                alert(
                    `${file.name} przekracza 5 MB`
                );

                continue;
            }

            const dataUrl =
                await this.fileToDataUrl(
                    file
                );

            this.attachments.push({

                name:
                file.name,

                type:
                file.type,

                size:
                file.size,

                dataUrl
            });
        }

        this.renderAttachmentsPreview();
    }

    fileToDataUrl(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();

                reader.onload =
                    () =>
                        resolve(
                            reader.result
                        );

                reader.onerror =
                    reject;

                reader.readAsDataURL(
                    file
                );
            }
        );
    }

    renderAttachmentsPreview() {

        if (
            !this.projectAttachmentsPreview
        ) {
            return;
        }

        this.projectAttachmentsPreview.innerHTML =
            "";

        this.attachments.forEach(
            (attachment, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                const fileName =
                    document.createElement(
                        "span"
                    );

                fileName.textContent =
                    attachment.name;

                const removeBtn =
                    document.createElement(
                        "button"
                    );

                removeBtn.type =
                    "button";

                removeBtn.textContent =
                    "Usuń";

                removeBtn.addEventListener(
                    "click",
                    () => {

                        this.usunZalacznik(
                            index
                        );
                    }
                );

                item.appendChild(
                    fileName
                );

                item.appendChild(
                    removeBtn
                );

                this.projectAttachmentsPreview.appendChild(
                    item
                );
            }
        );
    }

    usunZalacznik(index) {

        this.attachments.splice(
            index,
            1
        );

        this.renderAttachmentsPreview();
    }
}

const utworzProjekt =
    new ProjectCreate();

utworzProjekt.start();