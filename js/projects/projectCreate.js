import {
    addProject
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
    }

    start() {

        this.zaladujKlientow();

        this.projectForm?.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                this.zapiszProjekt();
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

            title:
                `${this.projectProductType.value} - ${this.projectNumber.value}`,

            projectNumber:
            this.projectNumber.value,

            clientId:
            this.projectClient.value,

            status:
            this.projectStatus.value,

            tags: [],

            productType:
            this.projectProductType.value,

            material:
            this.projectMaterial.value,

            deadline:
            this.projectDeadline.value,

            notes:
            this.projectNotes.value,

            documents: [],

            attachments: [],

            history: [
                {
                    type: "created",
                    date: now,
                    description: "Utworzono projekt"
                }
            ],

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

        const project =
            this.utworzObiektProjektu();

        addProject(project);

        alert(
            "Projekt został zapisany"
        );

        this.projectForm.reset();

        this.zaladujKlientow();
    }
}

const utworzProjekt =
    new ProjectCreate();

utworzProjekt.start();