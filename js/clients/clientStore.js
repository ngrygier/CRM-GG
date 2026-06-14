const CLIENTS_KEY = "clients";
export function loadClients() {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]");
}
export function saveClients(clients) {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}
export function addClient(client) {
    const clients = loadClients();
    clients.push(client);
    saveClients(clients);
}
export function getClientById(id) {
    return loadClients().find(client => String(client.id) === String(id));
}
export function deleteClient(id) {
    const clients = loadClients().filter(client => String(client.id) !== String(id));
    saveClients(clients);
}
export function updateClient(updatedClient) {
    const clients = loadClients().map(client => String(client.id) === String(updatedClient.id) ? updatedClient : client);
    saveClients(clients);
}