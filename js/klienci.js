let editingClientId = null;
const buttons = document.querySelectorAll('.status-item');

const formTitle = document.getElementById('formTitle');
const createSection = document.getElementById('createClientSection');
const listSection = document.getElementById('clientsListSection');
const detailsSection = document.getElementById('clientDetailsSection');
const clientForm = document.getElementById('clientForm');

const secondaryActionBtn = document.getElementById('secondaryActionBtn');

const submitBtn = document.getElementById('submitBtn');

buttons.forEach(button => {

    button.addEventListener('click', () => {

        buttons.forEach(btn =>
            btn.classList.remove('active-status')
        );

        button.classList.add('active-status');

        if (button.dataset.view === 'create') {

            createSection.hidden = false;
            listSection.hidden = true;
            detailsSection.hidden = true;
            detailsSection.innerHTML = '';

        } else {

            createSection.hidden = true;
            listSection.hidden = false;
            detailsSection.hidden = true;

            renderClients();
        }
    });

});

clientForm.addEventListener('submit', (e) => {

    if (!clientForm.checkValidity()) {
        e.preventDefault();
        clientForm.reportValidity();
        return;
    }

    e.preventDefault();

    let clients =
        JSON.parse(localStorage.getItem('clients')) || [];

    const phone = clientForm.phone.value.replace(/\s/g, '');

    const clientData = {

        id: editingClientId || Date.now(),

        firstName: clientForm.firstName.value.trim(),
        lastName: clientForm.lastName.value.trim(),
        phone: phone,
        email: clientForm.email.value.trim().toLowerCase(),
        city: clientForm.city.value.trim(),
        postalCode: clientForm.postalCode.value.trim(),
        address: clientForm.address.value.trim(),
        notes: clientForm.notes.value.trim()
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

    if (editingClientId) {

        const editedId = editingClientId;

        editingClientId = null;

        formTitle.textContent = 'Nowy klient';

        clientForm.reset();

        submitBtn.textContent = 'Zapisz klienta';

        secondaryActionBtn.textContent = 'Wyczyść';

        secondaryActionBtn.onclick = () => {
            clientForm.reset();
        };

        showClientDetails(editedId);

    } else {

        editingClientId = null;

        clientForm.reset();

        createSection.hidden = true;
        listSection.hidden = false;

        buttons.forEach(btn =>
            btn.classList.remove('active-status')
        );

        buttons[1].classList.add('active-status');

        renderClients();
    }
});

function formatPhone(phone) {
    return phone.replace(
        /(\d{3})(\d{3})(\d{3})/,
        '$1 $2 $3'
    );
}

function renderClients() {

    const clients =
        JSON.parse(localStorage.getItem('clients')) || [];

    if (clients.length === 0) {

        listSection.innerHTML = `
            <div class="table-card">
                <div class="info">
                    <h3>Brak klientów</h3>
                </div>
            </div>
        `;

        return;
    }

    listSection.innerHTML = `
    <div class="client-form">

        <div class="form-heading">
            <p class="eyebrow">Klienci</p>
            <h1>Lista klientów</h1>
        </div>

        <div class="clients-table-wrapper">

            <table class="clients-table">

                <thead>
                    <tr>
                        <th>Klient</th>
                        <th>Telefon</th>
                        <th>Email</th>
                        <th>Miasto</th>
                        <th>Akcje</th>
                    </tr>
                </thead>

                <tbody>

                    ${clients.map(client => {

        const formattedPhone = formatPhone(client.phone);

        return `
                            <tr>

                                <td>
                                    ${client.firstName}
                                    ${client.lastName}
                                </td>

                                <td>${formattedPhone}</td>

                                <td>${client.email}</td>

                                <td>${client.city}</td>

                                <td>

                                    <button
                                        class="secondary-btn"
                                        onclick="showClientDetails(${client.id})">
                                        Szczegóły
                                    </button>

                                </td>

                            </tr>
                        `;
    }).join('')}

                </tbody>

            </table>

        </div>

    </div>
    `;
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
    formTitle.textContent = 'Edycja klienta';

    submitBtn.textContent = 'Zapisz zmiany';

    secondaryActionBtn.textContent =
        'Powrót';

    secondaryActionBtn.onclick = () => {
        showClientDetails(id);
    };

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
    detailsSection.hidden = true;

    buttons.forEach(btn =>
        btn.classList.remove('active-status')
    );

    buttons[0].classList.add('active-status');
}

function showClientDetails(id) {

    const clients =
        JSON.parse(localStorage.getItem('clients')) || [];

    const client =
        clients.find(client => client.id === id);

    if (!client) return;

    buttons.forEach(btn =>
        btn.classList.remove('active-status')
    );

    buttons[1].classList.add('active-status');

    createSection.hidden = true;
    listSection.hidden = true;
    detailsSection.hidden = false;

    detailsSection.innerHTML = `

    <div class="client-form">

        <div class="form-heading">
            <p class="eyebrow">Klienci</p>
            <h1>Szczegóły klienta</h1>
        </div>

        <div class="client-details-card">

            <h2>
                ${client.firstName}
                ${client.lastName}
            </h2>

    <div class="details-grid">

        <div class="detail-item">
            <span class="label">Telefon</span>
            <span class="value">
                ${formatPhone(client.phone)}
            </span>
        </div>

        <div class="detail-item">
            <span class="label">Email</span>
            <span class="value">
                ${client.email || '-'}
            </span>
        </div>

        <div class="detail-item">
            <span class="label">Miasto</span>
            <span class="value">
                ${client.city || '-'}
            </span>
        </div>

        <div class="detail-item">
            <span class="label">Kod pocztowy</span>
            <span class="value">
                ${client.postalCode || '-'}
            </span>
        </div>

        <div class="detail-item full-width">
            <span class="label">Adres</span>
            <span class="value">
                ${client.address || '-'}
            </span>
        </div>

        <div class="detail-item full-width">
            <span class="label">Notatki</span>
            <span class="value">
                ${client.notes || '-'}
            </span>
        </div>

        </div>
    
        <hr>
    
        <h3>Powiązane projekty</h3>
    
        <div class="projects-placeholder">
            Brak projektów
        </div>
    
        <div class="actions">
    
            <button
                class="secondary-btn"
                onclick="backToClientsList()">
                Powrót
            </button>
    
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
}

function backToClientsList() {

    detailsSection.hidden = true;
    detailsSection.innerHTML = '';

    listSection.hidden = false;
}