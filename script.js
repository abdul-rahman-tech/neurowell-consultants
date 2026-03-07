// Mock Data
const mockData = {
    patients: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    psychiatrists: [
        { id: 1, name: 'Dr. Alice Johnson', email: 'alice@neurowell.com', status: 'active' },
        { id: 2, name: 'Dr. Bob Lee', email: 'bob@neurowell.com', status: 'pending' }
    ],
    appointments: [
        { id: 1, patient: 'John Doe', psychiatrist: 'Dr. Alice Johnson', date: '2023-10-15', time: '10:00', status: 'upcoming' },
        { id: 2, patient: 'Jane Smith', psychiatrist: 'Dr. Bob Lee', date: '2023-10-16', time: '14:00', status: 'pending' }
    ]
};

// Current Role (for demo, can be set via login)
let currentRole = 'patient';

// DOM Elements
const currentRoleEl = document.getElementById('current-role');
const sidebarMenuEl = document.getElementById('sidebar-menu');
const contentAreaEl = document.getElementById('content-area');
const logoutBtn = document.getElementById('logout-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    logoutBtn.addEventListener('click', () => {
        alert('Logged out');
        // In real app, redirect to login
    });
});

// Update UI based on role
function updateUI() {
    currentRoleEl.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    renderSidebar();
    renderContent('dashboard');
}

// Render Sidebar Menu
function renderSidebar() {
    let menuItems = [];
    if (currentRole === 'patient') {
        menuItems = [
            { label: 'Dashboard', action: 'dashboard' },
            { label: 'Book Appointment', action: 'book-appointment' },
            { label: 'My Appointments', action: 'my-appointments' },
            { label: 'Profile', action: 'profile' }
        ];
    } else if (currentRole === 'psychiatrist') {
        menuItems = [
            { label: 'Dashboard', action: 'dashboard' },
            { label: 'Appointment Requests', action: 'appointment-requests' },
            { label: 'Manage Slots', action: 'manage-slots' },
            { label: 'Profile', action: 'profile' }
        ];
    } else if (currentRole === 'admin') {
        menuItems = [
            { label: 'Dashboard', action: 'dashboard' },
            { label: 'Manage Users', action: 'manage-users' },
            { label: 'Manage Psychiatrists', action: 'manage-psychiatrists' }
        ];
    }
    sidebarMenuEl.innerHTML = menuItems.map(item => `<li><a href="#" onclick="renderContent('${item.action}')">${item.label}</a></li>`).join('');
}

// Render Main Content
function renderContent(page) {
    let content = '';
    if (currentRole === 'patient') {
        if (page === 'dashboard') {
            const total = mockData.appointments.filter(a => a.patient === 'John Doe').length; // Mock for current patient
            const upcoming = mockData.appointments.filter(a => a.status === 'upcoming').length;
            const cancelled = mockData.appointments.filter(a => a.status === 'cancelled').length;
            content = `
                <h1>Patient Dashboard</h1>
                <div class="card"><h3>Total Appointments</h3><p>${total}</p></div>
                <div class="card"><h3>Upcoming</h3><p>${upcoming}</p></div>
                <div class="card"><h3>Cancelled</h3><p>${cancelled}</p></div>
            `;
        } else if (page === 'book-appointment') {
            content = `
                <h1>Book Appointment</h1>
                <form id="book-form">
                    <label for="psychiatrist">Psychiatrist:</label>
                    <select id="psychiatrist" required>
                        ${mockData.psychiatrists.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                    </select>
                    <label for="date">Date:</label>
                    <input type="date" id="date" required>
                    <label for="time">Time Slot:</label>
                    <select id="time" required>
                        <option value="10:00">10:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                    </select>
                    <button type="submit">Book</button>
                </form>
            `;
            setTimeout(() => {
                document.getElementById('book-form').addEventListener('submit', handleBookAppointment);
            }, 0);
        } else if (page === 'my-appointments') {
            const appointments = mockData.appointments.filter(a => a.patient === 'John Doe');
            content = `
                <h1>My Appointments</h1>
                <table>
                    <thead>
                        <tr><th>Psychiatrist</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${appointments.map(a => `
                            <tr>
                                <td>${a.psychiatrist}</td>
                                <td>${a.date}</td>
                                <td>${a.time}</td>
                                <td>${a.status}</td>
                                <td>
                                    <button class="btn btn-danger" onclick="cancelAppointment(${a.id})">Cancel</button>
                                    <button class="btn btn-primary" onclick="rescheduleAppointment(${a.id})">Reschedule</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else if (page === 'profile') {
            content = `<h1>Profile</h1><p>Edit your profile here.</p>`;
        }
    } else if (currentRole === 'psychiatrist') {
        if (page === 'dashboard') {
            const todays = mockData.appointments.filter(a => a.date === '2023-10-15').length; // Mock today's date
            const pending = mockData.appointments.filter(a => a.status === 'pending').length;
            content = `
                <h1>Psychiatrist Dashboard</h1>
                <div class="card"><h3>Today’s Appointments</h3><p>${todays}</p></div>
                <div class="card"><h3>Pending Requests</h3><p>${pending}</p></div>
            `;
        } else if (page === 'appointment-requests') {
            const requests = mockData.appointments.filter(a => a.status === 'pending');
            content = `
                <h1>Appointment Requests</h1>
                <table>
                    <thead>
                        <tr><th>Patient</th><th>Date</th><th>Time</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${requests.map(a => `
                            <tr>
                                <td>${a.patient}</td>
                                <td>${a.date}</td>
                                <td>${a.time}</td>
                                <td>
                                    <button class="btn btn-success" onclick="approveAppointment(${a.id})">Approve</button>
                                    <button class="btn btn-danger" onclick="rejectAppointment(${a.id})">Reject</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else if (page === 'manage-slots') {
            content = `
                <h1>Manage Slots</h1>
                <form id="slot-form">
                    <label for="slot-date">Date:</label>
                    <input type="date" id="slot-date" required>
                    <label for="slot-time">Time:</label>
                    <input type="time" id="slot-time" required>
                    <button type="submit">Set Availability</button>
                </form>
            `;
            setTimeout(() => {
                document.getElementById('slot-form').addEventListener('submit', handleSetSlot);
            }, 0);
        } else if (page === 'profile') {
            content = `<h1>Profile</h1><p>Edit your profile here.</p>`;
        }
    } else if (currentRole === 'admin') {
        if (page === 'dashboard') {
            const patientsCount = mockData.patients.length;
            const psychiatristsCount = mockData.psychiatrists.length;
            const appointmentsCount = mockData.appointments.length;
            content = `
                <h1>Admin Dashboard</h1>
                <div class="card"><h3>Total Patients</h3><p>${patientsCount}</p></div>
                <div class="card"><h3>Total Psychiatrists</h3><p>${psychiatristsCount}</p></div>
                <div class="card"><h3>Total Appointments</h3><p>${appointmentsCount}</p></div>
            `;
        } else if (page === 'manage-users') {
            content = `
                <h1>Manage Users</h1>
                <table>
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${mockData.patients.map(u => `
                            <tr>
                                <td>${u.name}</td>
                                <td>${u.email}</td>
                                <td><button class="btn btn-danger" onclick="deleteUser(${u.id})">Delete</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else if (page === 'manage-psychiatrists') {
            content = `
                <h1>Manage Psychiatrists</h1>
                <table>
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${mockData.psychiatrists.map(p => `
                            <tr>
                                <td>${p.name}</td>
                                <td>${p.email}</td>
                                <td>${p.status}</td>
                                <td>
                                    <button class="btn btn-success" onclick="approvePsychiatrist(${p.id})">Approve</button>
                                    <button class="btn btn-danger" onclick="disablePsychiatrist(${p.id})">Disable</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }
    contentAreaEl.innerHTML = content;
}

// Form Handlers
function handleBookAppointment(e) {
    e.preventDefault();
    const psychiatrist = document.getElementById('psychiatrist').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (!psychiatrist || !date || !time) {
        alert('Please fill all fields.');
        return;
    }
    alert('Appointment booked!');
    // In real app, send to backend
}

function handleSetSlot(e) {
    e.preventDefault();
    const date = document.getElementById('slot-date').value;
    const time = document.getElementById('slot-time').value;
    if (!date || !time) {
        alert('Please fill all fields.');
        return;
    }
    alert('Slot set!');
    // In real app, send to backend
}

// Appointment Actions
function cancelAppointment(id) {
    alert('Appointment cancelled');
    // In real app, send to backend
}

function rescheduleAppointment(id) {
    alert('Reschedule appointment');
    // In real app, open reschedule form
}

function approveAppointment(id) {
    alert('Appointment approved');
    // In real app, send to backend
}

function rejectAppointment(id) {
    alert('Appointment rejected');
    // In real app, send to backend
}

function deleteUser(id) {
    alert('User deleted');
    // In real app, send to backend
}

function approvePsychiatrist(id) {
    alert('Psychiatrist approved');
    // In real app, send to backend
}

function disablePsychiatrist(id) {
    alert('Psychiatrist disabled');
    // In real app, send to backend
}