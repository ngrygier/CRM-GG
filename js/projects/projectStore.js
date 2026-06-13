const PROJECTS_KEY = "projects";

export function loadProjects() {
    return JSON.parse(
        localStorage.getItem(PROJECTS_KEY)
    ) || [];
}

export function saveProjects(projects) {
    localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(projects)
    );
}

export function addProject(project) {

    const projects =
        loadProjects();

    projects.push(project);

    saveProjects(projects);
}

export function getProjectById(id) {

    return loadProjects().find(
        project => project.id === id
    );
}

export function deleteProject(id) {

    const projects =
        loadProjects().filter(
            project => project.id !== id
        );

    saveProjects(projects);
}

export function updateProject(updatedProject) {

    const projects =
        loadProjects().map(project =>

            project.id === updatedProject.id
                ? updatedProject
                : project
        );

    saveProjects(projects);
}

export function reorderProjects(newOrder) {

    saveProjects(newOrder);
}