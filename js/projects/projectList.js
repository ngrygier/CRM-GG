import {
    loadProjects
} from "./projectStore.js";

class ProjectList {

    constructor() {

        this.projectsContainer =
            document.querySelector(
                "#projectsContainer"
            );

        this.searchInput =
            document.querySelector(
                "#projectSearch"
            );

        this.statusButtons =
            document.querySelectorAll(
                "[data-status]"
            );

        this.activeStatus =
            "all";

        this.searchText =
            "";

        this.searchTimeout =
            null;
    }

    start() {

        this.bindFilters();

        this.renderProjects();
    }

    renderProjects() {

        let projects =
            loadProjects();

        if (
            this.activeStatus !== "all"
        ) {

            projects =
                projects.filter(
                    project =>
                        project.status ===
                        this.activeStatus
                );
        }

        if (
            this.searchText
        ) {

            projects =
                projects.filter(
                    project => {

                        const clientName =
                            this.getClientName(
                                project.clientId
                            ).toLowerCase();

                        return (
                            project.projectNumber
                                .toLowerCase()
                                .includes(
                                    this.searchText
                                ) ||
                            clientName.includes(
                                this.searchText
                            ) ||
                            project.productType
                                .toLowerCase()
                                .includes(
                                    this.searchText
                                )
                        );
                    }
                );
        }

        this.projectsContainer.innerHTML = "";

        projects.forEach(project => {

            console.log(project.status);

            const card =
                document.createElement("div");

            card.className =
                "table-card";

            card.dataset.id =
                project.id;

            card.innerHTML = `
                <div class="
    status
    ${this.getStatusClass(
                project.status
            )}
"></div>

                <div class="info">
                    <h3>
                        ${this.getClientName(
                project.clientId
            )}
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

            card.addEventListener(
                "click",
                () => {

                    localStorage.setItem(
                        "selectedProjectId",
                        project.id
                    );

                    window.location.href =
                        "project.html";
                }
            );

            this.projectsContainer.appendChild(
                card
            );
        });
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
                    String(client.id) ===
                    String(clientId)
            );

        if (!client) {
            return "Nieznany klient";
        }

        return `
            ${client.firstName}
            ${client.lastName}
        `;
    }

    bindFilters() {

        this.statusButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.statusButtons.forEach(
                            btn =>
                                btn.classList.remove(
                                    "active-status"
                                )
                        );

                        button.classList.add(
                            "active-status"
                        );

                        this.activeStatus =
                            button.dataset.status;

                        this.renderProjects();
                    }
                );
            }
        );

        this.searchInput?.addEventListener(
            "input",
            () => {

                clearTimeout(
                    this.searchTimeout
                );

                this.searchTimeout =
                    setTimeout(() => {

                        this.searchText =
                            this.searchInput.value
                                .toLowerCase()
                                .trim();

                        this.renderProjects();

                    }, 300);
            }
        );
    }

    getStatusClass(status) {

        switch (status) {

            case "oczekujace":
                return "status-red";

            case "pomiar":
                return "status-orange";

            case "produkcja":
                return "status-yellow";

            case "zakonczone":
                return "status-green";

            default:
                return "";
        }
    }
}

const projectList =
    new ProjectList();

projectList.start();