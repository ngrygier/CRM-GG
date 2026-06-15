import {
    loadProjects
} from "./projectStore.js";
import {
    loadClients
} from "../clients/clientStore.js";
class ProjectList {
    constructor() {
        this.projectsContainer = document.querySelector("#projectsContainer");
        this.searchInput = document.querySelector("#projectSearch");
        this.statusButtons = document.querySelectorAll("[data-status]");
        this.activeStatus = "all";
        this.searchText = "";
        this.searchTimeout = null;
        this.sortSelect = document.querySelector("#projectSort");
        this.sortType = "newest";
        this.tagFilter = document.querySelector("#projectTagFilter");
        this.activeTag = "";
    }
    start() {
        this.bindFilters();
        this.renderTags();
        this.renderProjects();
    }
    renderProjects() {
        let projects = loadProjects();
        if (this.activeStatus !== "all") {
            projects = projects.filter(project => project.status === this.activeStatus);
        }
        if (this.activeTag) {
            projects = projects.filter(project => project.tags?.includes(this.activeTag));
        }
        if (this.searchText) {
            projects = projects.filter(project => {
                const clientName = this.getClientName(project.clientId).toLowerCase();
                return (project.projectNumber.toLowerCase().includes(this.searchText) || project.title.toLowerCase().includes(this.searchText) || clientName.includes(this.searchText) || project.productType.toLowerCase().includes(this.searchText));
            });
        }
        switch (this.sortType) {
            case "newest":
                projects.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "oldest":
                projects.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "numberAsc":
                projects.sort(
                    (a, b) => String(a.projectNumber).localeCompare(String(b.projectNumber)));
                break;
            case "numberDesc":
                projects.sort(
                    (a, b) => String(b.projectNumber).localeCompare(String(a.projectNumber)));
                break;
        }
        this.projectsContainer.innerHTML = "";
        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "table-card";
            card.dataset.id = project.id;
            card.innerHTML = `
            <div class="status ${this.getStatusClass(project.status)}"></div>
                <div class="info">
                    <h3>
                        ${this.getClientName(project.clientId)}
                    </h3>

                    <p>
                        Numer:
                        ${project.projectNumber}
                    </p>

                    <p>
                        Produkt:
                        ${project.productType}
                    </p>

                    <p>
                        Termin:
                        ${project.deadline}
                    </p>

                    <p>
                        Materiał:
                        ${project.material}
                    </p>
                </div>
            `;
            card.addEventListener("click",
                () => {
                    localStorage.setItem("selectedProjectId", project.id);
                    window.location.href = "project.html";
                });
            this.projectsContainer.appendChild(card);
        });
    }
    getClientName(clientId) {
        const clients = loadClients();
        const client = clients.find(client => String(client.id) === String(clientId));
        if (!client) {
            return "Nieznany klient";
        }
        return `${client.firstName} ${client.lastName}`;
    }
    bindFilters() {
        this.statusButtons.forEach(button => {
            button.addEventListener("click",
                () => {
                    this.statusButtons.forEach(btn => btn.classList.remove("active-status"));
                    button.classList.add("active-status");
                    this.activeStatus = button.dataset.status;
                    this.renderProjects();
                });
        });
        this.searchInput?.addEventListener("input",
            () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.searchText = this.searchInput.value.toLowerCase().trim();
                    this.renderProjects();
                }, 300);
            });
        this.sortSelect?.addEventListener("change",
            () => {
                this.sortType = this.sortSelect.value;
                this.renderProjects();
            });
        this.tagFilter?.addEventListener("change",
            () => {
                this.activeTag = this.tagFilter.value;
                this.renderProjects();
            });
    }
    getStatusClass(status) {
        switch (status) {
            case "oczekujace":
                return "status-red";
            case "do_pomiaru":
                return "status-orange";
            case "produkcja":
                return "status-yellow";
            case "zakonczone":
                return "status-green";
            default:
                return "";
        }
    }
    renderTags() {
        if (!this.tagFilter) {
            return;
        }
        const projects = loadProjects();
        const tags = [...new Set(projects.flatMap(project => project.tags || []))];
        this.tagFilter.innerHTML = `<option value="">Wszystkie tagi</option>`;
        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag;
            option.textContent = tag;
            this.tagFilter.appendChild(option);
        });
    }
}
const projectList = new ProjectList();
projectList.start();