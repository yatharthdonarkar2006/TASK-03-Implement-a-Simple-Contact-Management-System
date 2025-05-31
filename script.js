// Contact Management System

let contacts = [];
let currentView = 'table';
let currentSort = 'name';

// Theme Management
const themeToggle = document.getElementById('checkbox');
themeToggle.addEventListener('change', () => {
    document.body.setAttribute('data-theme', themeToggle.checked ? 'dark' : 'light');
    localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
}

// Load contacts from localStorage
function loadContacts() {
    const stored = localStorage.getItem('contacts');
    contacts = stored ? JSON.parse(stored) : [];
    updateContactCount();
    sortContacts(currentSort);
}

// Save contacts to localStorage
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    updateContactCount();
}

// Update contact count display
function updateContactCount() {
    document.getElementById('contact-count').textContent = contacts.length;
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    messageElement.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Sort contacts
function sortContacts(sortBy) {
    currentSort = sortBy;
    contacts.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'phone') {
            return a.phone.localeCompare(b.phone);
        } else if (sortBy === 'email') {
            return a.email.localeCompare(b.email);
        }
    });
    renderContacts();
}

// Render contacts in the table
function renderContacts(filteredContacts = null) {
    const tbody = document.querySelector('#contacts-table tbody');
    const gridContainer = document.getElementById('grid-view');
    tbody.innerHTML = '';
    gridContainer.innerHTML = '';
    
    const contactsToRender = filteredContacts || contacts;
    
    if (currentView === 'table') {
        contactsToRender.forEach((contact, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td class="actions">
                    <button onclick="showContactDetails(${idx})" class="view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button onclick="editContact(${idx})" class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteContact(${idx})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        contactsToRender.forEach((contact, idx) => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <h3>${contact.name}</h3>
                <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                <p><i class="fas fa-envelope"></i> ${contact.email}</p>
                <div class="card-actions">
                    <button onclick="showContactDetails(${idx})" class="view-btn">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editContact(${idx})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteContact(${idx})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }
}

// Show contact details in modal
function showContactDetails(idx) {
    const contact = contacts[idx];
    const modal = document.getElementById('contact-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="contact-details">
            <p><strong><i class="fas fa-user"></i> Name:</strong> ${contact.name}</p>
            <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${contact.phone}</p>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${contact.email}</p>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('contact-modal').classList.remove('show');
});

// Search contacts
function searchContacts(query) {
    query = query.toLowerCase();
    const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
    );
    renderContacts(filtered);
}

// Clear search
document.getElementById('clear-search').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    renderContacts();
});

// Toggle form visibility
document.getElementById('toggle-form').addEventListener('click', () => {
    const form = document.getElementById('contact-form');
    const icon = document.querySelector('#toggle-form i');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    icon.className = form.style.display === 'none' ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
});

// Toggle view (table/grid)
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view) {
            currentView = view;
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelector('.table-container').style.display = view === 'table' ? 'block' : 'none';
            document.getElementById('grid-view').style.display = view === 'grid' ? 'grid' : 'none';
            renderContacts();
        }
    });
});

// Sort contacts
document.getElementById('sort-by').addEventListener('change', (e) => {
    sortContacts(e.target.value);
});

// Add or update contact
function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('contact-id').value;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!name || !phone || !email) return;
    
    if (id === '') {
        // Add new
        contacts.push({ name, phone, email });
        showNotification('Contact added successfully!');
    } else {
        // Update existing
        contacts[id] = { name, phone, email };
        showNotification('Contact updated successfully!');
    }
    
    saveContacts();
    sortContacts(currentSort);
    resetForm();
}

// Edit contact
window.editContact = function(idx) {
    const contact = contacts[idx];
    document.getElementById('contact-id').value = idx;
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Contact';
    document.getElementById('cancel-btn').style.display = 'inline-block';
}

// Delete contact
window.deleteContact = function(idx) {
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts.splice(idx, 1);
        saveContacts();
        sortContacts(currentSort);
        resetForm();
        showNotification('Contact deleted successfully!');
    }
}

// Reset form
function resetForm() {
    document.getElementById('contact-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-plus"></i> Add Contact';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Event Listeners
document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
document.getElementById('cancel-btn').addEventListener('click', resetForm);
document.getElementById('search-input').addEventListener('input', (e) => {
    searchContacts(e.target.value);
});

// Initialize
loadContacts();
renderContacts(); 