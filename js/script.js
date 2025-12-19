// API Base URL
const API_BASE_URL = "http://localhost:5001/api";

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupModals();
    setupProjectForm();
    setupClientForm();
    loadProjects();
    loadClients();
    loadContacts();
    loadNewsletters();
});

// ============== TAB FUNCTIONALITY ==============
function setupTabs() {
    const tabButtons = document.querySelectorAll('. tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList. remove('active');
            });
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            this.classList.add('active');
        });
    });
}

// ============== MODAL FUNCTIONALITY ==============
function setupModals() {
    // Add Project Button
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectModal = document.getElementById('projectModal');
    
    if (addProjectBtn && projectModal) {
        addProjectBtn.addEventListener('click', function() {
            projectModal.classList.remove('hidden');
        });
    }

    // Add Client Button
    const addClientBtn = document.getElementById('addClientBtn');
    const clientModal = document.getElementById('clientModal');
    
    if (addClientBtn && clientModal) {
        addClientBtn.addEventListener('click', function() {
            clientModal.classList.remove('hidden');
        });
    }

    // Close Buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal. classList.add('hidden');
            }
        });
    });

    // Close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    });
}

// ============== PROJECT FORM ==============
function setupProjectForm() {
    const projectForm = document. getElementById('projectForm');
    
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showMessage('projectMessage', 'Project added successfully!', 'alert-success');
                projectForm.reset();
                document.getElementById('projectModal').classList.add('hidden');
                loadProjects();
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('projectMessage', 'Error adding project.  Please try again.', 'alert-danger');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }
}

// ============== CLIENT FORM ==============
function setupClientForm() {
    const clientForm = document. getElementById('clientForm');
    
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showMessage('clientMessage', 'Client added successfully!', 'alert-success');
                clientForm.reset();
                document.getElementById('clientModal').classList.add('hidden');
                loadClients();
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('clientMessage', 'Error adding client. Please try again.', 'alert-danger');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn. textContent = originalText;
            });
        });
    }
}

// ============== LOAD PROJECTS ==============
function loadProjects() {
    const projectsTable = document.getElementById('projectsTable');

    if (! projectsTable) return;

    fetch(`${API_BASE_URL}/projects`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                projectsTable.innerHTML = data.map(project => `
                    <tr>
                        <td>${project.name}</td>
                        <td>${project. description. substring(0, 50)}...</td>
                        <td>
                            <button class="delete-btn" onclick="deleteProject('${project._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                projectsTable.innerHTML = '<tr><td colspan="3" class="loading">No projects found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            projectsTable.innerHTML = '<tr><td colspan="3" class="loading">Error loading projects</td></tr>';
        });
}

// ============== LOAD CLIENTS ==============
function loadClients() {
    const clientsTable = document.getElementById('clientsTable');

    if (!clientsTable) return;

    fetch(`${API_BASE_URL}/clients`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                clientsTable.innerHTML = data.map(client => `
                    <tr>
                        <td>${client. name}</td>
                        <td>${client.designation}</td>
                        <td>${client.description.substring(0, 30)}...</td>
                        <td>
                            <button class="delete-btn" onclick="deleteClient('${client._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                clientsTable.innerHTML = '<tr><td colspan="4" class="loading">No clients found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            clientsTable.innerHTML = '<tr><td colspan="4" class="loading">Error loading clients</td></tr>';
        });
}

// ============== LOAD CONTACTS ==============
function loadContacts() {
    const contactsTable = document.getElementById('contactsTable');

    if (!contactsTable) return;

    fetch(`${API_BASE_URL}/contact`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                contactsTable.innerHTML = data.map(contact => `
                    <tr>
                        <td>${contact.fullName}</td>
                        <td>${contact.email}</td>
                        <td>${contact. mobile}</td>
                        <td>${contact.city}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteContact('${contact._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                contactsTable.innerHTML = '<tr><td colspan="5" class="loading">No contacts found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            contactsTable.innerHTML = '<tr><td colspan="5" class="loading">Error loading contacts</td></tr>';
        });
}

// ============== LOAD NEWSLETTERS ==============
function loadNewsletters() {
    const newsletterTable = document.getElementById('newsletterTable');

    if (!newsletterTable) return;

    fetch(`${API_BASE_URL}/newsletter`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                newsletterTable. innerHTML = data.map(newsletter => `
                    <tr>
                        <td>${newsletter.email}</td>
                        <td>${new Date(newsletter.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteNewsletter('${newsletter._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                newsletterTable.innerHTML = '<tr><td colspan="3" class="loading">No subscriptions found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            newsletterTable.innerHTML = '<tr><td colspan="3" class="loading">Error loading newsletters</td></tr>';
        });
}

// ============== DELETE FUNCTIONS ==============
function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE'
        })
        .then(() => loadProjects())
        .catch(error => console.error('Error:', error));
    }
}

function deleteClient(id) {
    if (confirm('Are you sure you want to delete this client?')) {
        fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'DELETE'
        })
        .then(() => loadClients())
        .catch(error => console.error('Error:', error));
    }
}

function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact? ')) {
        fetch(`${API_BASE_URL}/contact/${id}`, {
            method: 'DELETE'
        })
        .then(() => loadContacts())
        .catch(error => console.error('Error:', error));
    }
}

function deleteNewsletter(id) {
    if (confirm('Are you sure you want to delete this subscription?')) {
        fetch(`${API_BASE_URL}/newsletter/${id}`, {
            method: 'DELETE'
        })
        .then(() => loadNewsletters())
        .catch(error => console.error('Error:', error));
    }
}

// ============== HELPER FUNCTION ==============
function showMessage(elementId, text, className) {
    const messageElement = document.getElementById(elementId);
    if (! messageElement) return;
    
    messageElement.textContent = text;
    messageElement. className = `alert ${className}`;
    messageElement.classList.remove('hidden');

    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}
