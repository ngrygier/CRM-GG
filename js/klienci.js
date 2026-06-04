let editingClientId = null;
const buttons = document.querySelectorAll('.status-item');

const createSection = document.getElementById('createClientSection');
const listSection = document.getElementById('clientsListSection');
const clientForm = document.getElementById('clientForm');

buttons.forEach(button => {

    button.addEventListener('click', () => {

        buttons.forEach(btn =>
            btn.classList.remove('active-status')
        );

        button.classList.add('active-status');

        if (button.dataset.view === 'create') {

            createSection.hidden = false;
            listSection.hidden = true;

        } else {

            createSection.hidden = true;
            listSection.hidden = false;

            renderClients();
        }
    });

});

clientForm.addEventListener('submit', (e) => {

    e.preventDefault();

    let clients =
        JSON.parse(localStorage.getItem('clients')) || [];

    const clientData = {

        id: editingClientId || Date.now(),

        firstName: clientForm.firstName.value,
        lastName: clientForm.lastName.value,
        phone: clientForm.phone.value,
        email: clientForm.email.value,
        city: clientForm.city.value,
        postalCode: clientForm.postalCode.value,
        address: clientForm.address.value,
        notes: clientForm.notes.value
    };

    if (editingClientId) {

        clients = clients.map(client =>
            client.id === editingClientId
                ? clientData
                : client
        );

        alert("Klient zaktualizowany");

    } else {

        clients.push(clientData);

        alert("Klient dodany");
    }

    localStorage.setItem(
        'clients',
        JSON.stringify(clients)
    );

    editingClientId = null;

    clientForm.reset();

    renderClients();
});

function renderClients() {

    const clients =
        JSON.parse(localStorage.getItem('clients')) || [];

    listSection.innerHTML = '';

    if (clients.length === 0) {

        listSection.innerHTML =
            '<div class="table-card"><div class="info"><h3>Brak klientów</h3></div></div>';

        return;
    }

    clients.forEach(client => {

        listSection.innerHTML += `
            <div class="table-card">

                <div class="info">

                    <h3>
                        ${client.firstName}
                        ${client.lastName}
                    </h3>

                    <p>📞 ${client.phone}</p>

                    <p>✉ ${client.email}</p>

                    <p>📍 ${client.city}</p>
                    
                    <div class="actions">

                <button
                    class="secondary-btn"
                    onclick="editClient(${client.id})">
                    Edytuj
                </button>

                <button
                    class="primary-btn"
                    onclick="deleteClient(${client.id})">
                    Usuń
                </button>

            </div>

                </div>

            </div>
        `;
    });
}

function deleteClient(id) {

    const confirmed =
        confirm("Czy na pewno usunąć klienta?");

    if (!confirmed) return;

    let clients =
        JSON.parse(localStorage.getItem("clients")) || [];

    clients = clients.filter(
        client => client.id !== id
    );

    localStorage.setItem(
        "clients",
        JSON.stringify(clients)
    );

    renderClients();
}

function editClient(id) {

    const clients =
        JSON.parse(localStorage.getItem("clients")) || [];

    const client =
        clients.find(client => client.id === id);

    if (!client) return;

    editingClientId = id;

    clientForm.firstName.value = client.firstName;
    clientForm.lastName.value = client.lastName;
    clientForm.phone.value = client.phone;
    clientForm.email.value = client.email;
    clientForm.city.value = client.city;
    clientForm.postalCode.value = client.postalCode;
    clientForm.address.value = client.address;
    clientForm.notes.value = client.notes;

    createSection.hidden = false;
    listSection.hidden = true;

    buttons.forEach(btn =>
        btn.classList.remove('active-status')
    );

    buttons[0].classList.add('active-status');
}
