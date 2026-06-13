import {
    loadProjects,
    deleteProject
} from "./projectStore.js";

class ProjectDetails {

    constructor() {

        this.projectTitle =
            document.querySelector(
                "#projectTitle"
            );

        this.projectStatus =
            document.querySelector(
                "#projectStatus"
            );

        this.projectClient =
            document.querySelector(
                "#projectClient"
            );

        this.projectType =
            document.querySelector(
                "#projectType"
            );

        this.projectDeadline =
            document.querySelector(
                "#projectDeadline"
            );

        this.projectMaterial =
            document.querySelector(
                "#projectMaterial"
            );

        this.projectNotes =
            document.querySelector(
                "#projectNotes"
            );

        this.backBtn =
            document.querySelector(
                "#backBtn"
            );

        this.deleteProjectBtn =
            document.querySelector(
                "#deleteProjectBtn"
            );

        this.editProjectBtn =
            document.querySelector(
                "#editProjectBtn"
            );

        this.exportProjectBtn =
            document.querySelector(
                "#exportProjectBtn"
            );
    }

    start() {

        this.renderProject();

        this.backBtn?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "projectPanel.html";
            }
        );

        this.deleteProjectBtn?.addEventListener(
            "click",
            () => {

                this.deleteCurrentProject();
            }
        );

        this.editProjectBtn?.addEventListener(
            "click",
            () => {

                this.editProject();
            }
        );

        this.exportProjectBtn?.addEventListener(
            "click",
            () => {

                this.eksportujProjekt();
            }
        );
    }

    renderProject() {

        const selectedId =
            localStorage.getItem(
                "selectedProjectId"
            );

        const project =
            loadProjects().find(
                project =>
                    project.id === selectedId
            );

        if (!project) {

            this.projectTitle.textContent =
                "Nie znaleziono projektu";

            return;
        }

        this.projectTitle.textContent =
            project.projectNumber;

        this.projectStatus.textContent =
            project.status;

        this.projectType.textContent =
            project.productType;

        this.projectDeadline.textContent =
            project.deadline || "-";

        this.projectMaterial.textContent =
            project.material || "-";

        this.projectNotes.textContent =
            project.notes || "-";

        this.projectClient.textContent =
            this.getClientName(
                project.clientId
            );
    }

    getClientName(clientId) {

        const clients =
            JSON.parse(
                localStorage.getItem(
                    "clients"
                )
            ) || [];

        const client =
            clients.find(
                client =>
                    String(client.id)
                    === String(clientId)
            );

        if (!client) {

            return "Nieznany klient";
        }

        return `
            ${client.firstName}
            ${client.lastName}
        `;
    }

    deleteCurrentProject() {

        const confirmed =
            confirm(
                "Czy na pewno usunąć projekt?"
            );

        if (!confirmed) {
            return;
        }

        const selectedId =
            localStorage.getItem(
                "selectedProjectId"
            );

        deleteProject(
            selectedId
        );

        localStorage.removeItem(
            "selectedProjectId"
        );

        window.location.href =
            "projectPanel.html";
    }

    editProject() {

        const selectedId =
            localStorage.getItem(
                "selectedProjectId"
            );

        window.location.href =
            `../utworz.html?view=project&edit=${selectedId}`;
    }

    eksportujProjekt() {

        const selectedId =
            localStorage.getItem(
                "selectedProjectId"
            );

        const project =
            loadProjects().find(
                project =>
                    project.id === selectedId
            );

        if (!project) {

            alert(
                "Nie znaleziono projektu"
            );

            return;
        }

        const exportData = {

            version: 1,

            kind: "project",

            project
        };

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        exportData,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            `${project.projectNumber}.json`;

        link.click();

        URL.revokeObjectURL(
            url
        );
    }
}

const projectDetails =
    new ProjectDetails();

projectDetails.start();