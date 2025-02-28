// Global variables
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let votes = JSON.parse(localStorage.getItem('votes')) || { "John Doe": 0, "Jane Smith": 0, "Mary Johnson": 0 };
let currentUser = null;
let votingStart = localStorage.getItem('votingStart');
let votingEnd = localStorage.getItem('votingEnd');
let isAdminLoggedIn = false;

// Show different pages based on navigation
function showPage(page) {
    const pages = document.querySelectorAll('.container');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');
}

// Registration form submission
document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    if (registeredUsers.some(user => user.studentId === studentId)) {
        alert('Student ID already registered!');
        return;
    }

    registeredUsers.push({ studentId, studentName, role, password });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful!');
    showPage('login');
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = document.getElementById('loginStudentId').value;
    const password = document.getElementById('loginPassword').value;

    currentUser = registeredUsers.find(user => user.studentId === studentId && user.password === password);

    if (!currentUser) {
        alert('Invalid login credentials!');
        return;
    }

    alert('Login successful!');
    if (currentUser.role === 'user') {
        if (localStorage.getItem(currentUser.studentId + '-voted')) {
            alert('You have already voted!');
            showPage('welcome');
        } else if (isVotingAllowed()) {
            showPage('voting');
        } else {
            alert('Voting is not allowed at this time.');
            showPage('welcome');
        }
    } else {
        showPage('results');
    }
});

// Admin login form submission
document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;

    if (adminUsername === 'admin' && adminPassword === 'password') {
        isAdminLoggedIn = true;
        showPage('results');
    } else {
        alert('Invalid admin credentials!');
    }
});

// Voting form submission
document.getElementById('votingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedCandidate = document.getElementById('candidate').value;

    if (!currentUser) {
        alert('You must be logged in to vote!');
        return;
    }

    if (localStorage.getItem(currentUser.studentId + '-voted')) {
        alert('You have already voted!');
        return;
    }

    if (!isVotingAllowed()) {
        alert('Voting is closed.');
        return;
    }

    votes[selectedCandidate]++;
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem(currentUser.studentId + '-voted', 'true');

    document.getElementById('voteMessage').textContent = `Thank you for voting for ${selectedCandidate}`;
    showPage('welcome');

    updateResults();
});

// Update the results page with current votes
function updateResults() {
    document.getElementById('johnVotes').textContent = votes["John Doe"];
    document.getElementById('janeVotes').textContent = votes["Jane Smith"];
    document.getElementById('maryVotes').textContent = votes["Mary Johnson"];

    const winner = Object.entries(votes).reduce((a, b) => a[1] > b[1] ? a : b);
    document.getElementById('winner').textContent = winner[0];
}

// Save voting start and end time
function saveVotingTimes() {
    const startDateTime = document.getElementById('startDateTime').value;
    const endDateTime = document.getElementById('endDateTime').value;

    localStorage.setItem('votingStart', startDateTime);
    localStorage.setItem('votingEnd', endDateTime);
}

// Check if voting is allowed
function isVotingAllowed() {
    const now = new Date();
    const start = new Date(votingStart);
    const end = new Date(votingEnd);
    return now >= start && now <= end;
}

// Initial result table update
updateResults();
