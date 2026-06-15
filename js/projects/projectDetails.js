import {
    loadProjects,
    deleteProject
} from "./projectStore.js";
import {
    loadClients
} from "../clients/clientStore.js";
class ProjectDetails {
    constructor() {
        this.projectTitle = document.querySelector("#projectTitle");
        this.projectStatus = document.querySelector("#projectStatus");
        this.projectClient = document.querySelector("#projectClient");
        this.projectType = document.querySelector("#projectType");
        this.projectDeadline = document.querySelector("#projectDeadline");
        this.projectMaterial = document.querySelector("#projectMaterial");
        this.projectNotes = document.querySelector("#projectNotes");
        this.backBtn = document.querySelector("#backBtn");
        this.deleteProjectBtn = document.querySelector("#deleteProjectBtn");
        this.editProjectBtn = document.querySelector("#editProjectBtn");
        this.exportProjectBtn = document.querySelector("#exportProjectBtn");
        this.currentProject = null;
        this.projectDocuments = document.querySelector("#projectDocuments");
        this.projectAttachments = document.querySelector("#projectAttachments");
    }
    async start() {
        await Promise.all([
            this.loadProjectData(),
            this.loadClientData()
        ]);
        this.renderProject();
        this.backBtn?.addEventListener("click",
            () => {
                window.location.href = "projectPanel.html";
            });
        this.deleteProjectBtn?.addEventListener("click",
            () => this.deleteCurrentProject());
        this.editProjectBtn?.addEventListener("click",
            () => this.editProject());
        this.exportProjectBtn?.addEventListener("click",
            () => this.eksportujProjekt());
    }
    async loadProjectData() {
        return loadProjects();
    }
    async loadClientData() {
        return loadClients();
    }
    renderProject() {
        const selectedId = localStorage.getItem("selectedProjectId");
        const project = loadProjects().find(project => project.id === selectedId);
        this.currentProject = project;
        if (!project) {
            this.projectTitle.textContent = "Nie znaleziono projektu";
            return;
        }
        this.projectTitle.textContent = project.projectNumber;
        this.projectStatus.textContent = project.status;
        this.projectType.textContent = project.productType;
        this.projectDeadline.textContent = project.deadline || "-";
        this.projectMaterial.textContent = project.material || "-";
        this.projectNotes.textContent = project.notes || "-";
        this.projectClient.textContent = this.getClientName(project.clientId);
        this.renderDocuments(project);
        this.renderAttachments(project);
    }
    getClientName(clientId) {
        const clients = loadClients();
        const client = clients.find(client => String(client.id) === String(clientId));
        if (!client) {
            return "Nieznany klient";
        }
        return `
            ${client.firstName}
            ${client.lastName}
        `;
    }
    deleteCurrentProject() {
        const confirmed = confirm("Czy na pewno usunąć projekt?");
        if (!confirmed) {
            return;
        }
        deleteProject(this.currentProject.id);
        localStorage.removeItem("selectedProjectId");
        window.location.href = "projectPanel.html";
    }
    editProject() {
        window.location.href = `../utworz.html?edit=${this.currentProject.id}#project`;
    }
    eksportujProjekt() {
        const project = this.currentProject;
        if (!project) {
            alert("Nie znaleziono projektu");
            return;
        }
        const exportData = {
            version: 1,
            kind: "project",
            project
        };
        const blob = new Blob(
            [
                JSON.stringify(exportData, null, 2)
            ], {
                type: "application/json"
            });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${project.projectNumber}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
    renderDocuments(project) {
        const documents = project.documents || [];
        if (!documents.length) {
            this.projectDocuments.textContent = "Brak dokumentów";
            return;
        }
        this.projectDocuments.innerHTML = "";
        documents.forEach(doc => {
            const item = document.createElement("div");
            item.className = "document-item";
            item.textContent = doc.meta?.numer || doc.meta?.id || "Dokument";
            this.projectDocuments.appendChild(item);
        });
    }
    renderAttachments(project) {
        const attachments = project.attachments || [];
        if (!attachments.length) {
            this.projectAttachments.textContent = "Brak załączników";
            return;
        }
        this.projectAttachments.innerHTML = "";
        attachments.forEach(attachment => {
            const item = document.createElement("div");
            item.className = "attachment-item";
            item.style.cursor = "pointer";
            const sizeInKb = (attachment.size / 1024).toFixed(1);
            if (attachment.type?.startsWith("image/")) {
                const image = document.createElement("img");
                image.src = attachment.dataUrl;
                image.alt = attachment.name;
                image.style.width = "150px";
                image.style.height = "150px";
                image.style.objectFit = "cover";
                const imageInfo = document.createElement("div");
                imageInfo.innerHTML = `
                <strong>${attachment.name}</strong>
                <br>
                ${attachment.type}
                <br>
                ${sizeInKb} KB
            `;
                item.appendChild(image);
                item.appendChild(imageInfo);
            } else {
                const fileInfo = document.createElement("div");
                fileInfo.innerHTML = `
                <strong>📄 ${attachment.name}</strong>
                <br>
                ${attachment.type}
                <br>
                ${sizeInKb} KB
            `;
                item.appendChild(fileInfo);
            }
            item.addEventListener("click",
                () => {
                    const link = document.createElement("a");
                    link.href = attachment.dataUrl;
                    link.download = attachment.name;
                    link.click();
                });
            this.projectAttachments.appendChild(item);
        });
    }
}
const projectDetails = new ProjectDetails();
projectDetails.start();