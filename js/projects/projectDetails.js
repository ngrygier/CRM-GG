import {
    loadProjects
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
    }

    start() {

        this.renderProject();
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
}

const projectDetails =
    new ProjectDetails();

projectDetails.start();