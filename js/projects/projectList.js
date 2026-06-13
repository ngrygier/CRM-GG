import {
    loadProjects
} from "./projectStore.js";

class ProjectList {

    constructor() {

        this.projectsContainer =
            document.querySelector(
                "#projectsContainer"
            );
    }

    start() {

        this.renderProjects();
    }

    renderProjects() {

        const projects =
            loadProjects();

        this.projectsContainer.innerHTML = "";

        projects.forEach(project => {

            const card =
                document.createElement("div");

            card.className =
                "table-card";

            card.dataset.id =
                project.id;

            card.innerHTML = `

            <div class="status"></div>

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
                        "projekt.html";
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

const projectList =
    new ProjectList();

projectList.start();