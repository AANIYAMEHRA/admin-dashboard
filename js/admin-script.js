// API Base URL
const API_BASE_URL = "http://localhost:5001/api";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupModals();
  setupProjectForm();
  setupClientForm();
  loadProjects();
  loadClients();
  loadContacts();
  loadNewsletters();
});

/* ================= TABS ================= */
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;

      document.querySelectorAll(".tab-content").forEach(tab =>
        tab.classList.remove("active")
      );

      tabButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      document.getElementById(tabName)?.classList.add("active");
      button.classList.add("active");
    });
  });
}

/* ================= MODALS ================= */
function setupModals() {
  const projectModal = document.getElementById("projectModal");
  const clientModal = document.getElementById("clientModal");

  document.getElementById("addProjectBtn")?.addEventListener("click", () =>
    projectModal.classList.remove("hidden")
  );

  document.getElementById("addClientBtn")?.addEventListener("click", () =>
    clientModal.classList.remove("hidden")
  );

  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.modal)?.classList.add("hidden");
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });
}

/* ================= PROJECT FORM ================= */
function setupProjectForm() {
  const form = document.getElementById("projectForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const btn = form.querySelector(".submit-btn");
    btn.disabled = true;
    btn.textContent = "Adding...";

    fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      body: new FormData(form)
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        showMessage("projectMessage", "Project added successfully", "alert-success");
        form.reset();
        document.getElementById("projectModal").classList.add("hidden");
        loadProjects();
      })
      .catch(() =>
        showMessage("projectMessage", "Failed to add project", "alert-danger")
      )
      .finally(() => {
        btn.disabled = false;
        btn.textContent = "Add Project";
      });
  });
}

/* ================= CLIENT FORM ================= */
function setupClientForm() {
  const form = document.getElementById("clientForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const btn = form.querySelector(".submit-btn");
    btn.disabled = true;
    btn.textContent = "Adding...";

    fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      body: new FormData(form)
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        showMessage("clientMessage", "Client added successfully", "alert-success");
        form.reset();
        document.getElementById("clientModal").classList.add("hidden");
        loadClients();
      })
      .catch(() =>
        showMessage("clientMessage", "Failed to add client", "alert-danger")
      )
      .finally(() => {
        btn.disabled = false;
        btn.textContent = "Add Client";
      });
  });
}

/* ================= LOAD PROJECTS ================= */
function loadProjects() {
  const table = document.getElementById("projectsTable");
  if (!table) return;

  fetch(`${API_BASE_URL}/projects`)
    .then(res => res.json())
    .then(data => {
      table.innerHTML = data.length
        ? data.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.description?.substring(0, 50)}...</td>
            <td>
              <button class="delete-btn" onclick="deleteProject('${p._id}')">Delete</button>
            </td>
          </tr>
        `).join("")
        : `<tr><td colspan="3">No projects found</td></tr>`;
    });
}

/* ================= LOAD CLIENTS ================= */
function loadClients() {
  const table = document.getElementById("clientsTable");
  if (!table) return;

  fetch(`${API_BASE_URL}/clients`)
    .then(res => res.json())
    .then(data => {
      table.innerHTML = data.length
        ? data.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.designation}</td>
            <td>${c.description?.substring(0, 30)}...</td>
            <td>
              <button class="delete-btn" onclick="deleteClient('${c._id}')">Delete</button>
            </td>
          </tr>
        `).join("")
        : `<tr><td colspan="4">No clients found</td></tr>`;
    });
}

/* ================= LOAD CONTACTS ================= */
function loadContacts() {
  fetch(`${API_BASE_URL}/contact`)
    .then(res => res.json())
    .then(data => {
      contactsTable.innerHTML = data.map(c => `
        <tr>
          <td>${c.fullName}</td>
          <td>${c.email}</td>
          <td>${c.mobile}</td>
          <td>${c.city}</td>
          <td><button class="delete-btn" onclick="deleteContact('${c._id}')">Delete</button></td>
        </tr>
      `).join("");
    });
}

/* ================= LOAD NEWSLETTERS ================= */
function loadNewsletters() {
  fetch(`${API_BASE_URL}/newsletter`)
    .then(res => res.json())
    .then(data => {
      newsletterTable.innerHTML = data.map(n => `
        <tr>
          <td>${n.email}</td>
          <td>${new Date(n.createdAt).toLocaleDateString()}</td>
          <td><button class="delete-btn" onclick="deleteNewsletter('${n._id}')">Delete</button></td>
        </tr>
      `).join("");
    });
}

/* ================= DELETE ================= */
const deleteProject = id =>
  confirm("Delete project?") &&
  fetch(`${API_BASE_URL}/projects/${id}`, { method: "DELETE" }).then(loadProjects);

const deleteClient = id =>
  confirm("Delete client?") &&
  fetch(`${API_BASE_URL}/clients/${id}`, { method: "DELETE" }).then(loadClients);

const deleteContact = id =>
  confirm("Delete contact?") &&
  fetch(`${API_BASE_URL}/contact/${id}`, { method: "DELETE" }).then(loadContacts);

const deleteNewsletter = id =>
  confirm("Delete subscription?") &&
  fetch(`${API_BASE_URL}/newsletter/${id}`, { method: "DELETE" }).then(loadNewsletters);

/* ================= MESSAGE ================= */
function showMessage(id, text, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `alert ${cls}`;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 4000);
}
