// auth.js - Authentication logic
import { LS_KEYS, getData, setData, generateJWT, parseJWT, isTokenExpired, showToast, showScreen } from './utils.js';

// Initialize users with default admin if none
(function initDefaultAdmin() {
    const users = getData(LS_KEYS.USERS);
    if (!users.length) {
        users.push({
            name: 'System Administrator',
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123', // Default password (needs change)
            role: 'admin',
            mustChangePwd: true,
            active: true
        });
        setData(LS_KEYS.USERS, users);
    }
})();

// Cached DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const resetForm = document.getElementById('reset-password-form');
const changePwdForm = document.getElementById('change-password-form');

// Event Listeners
if (loginForm) loginForm.addEventListener('submit', onLogin);
if (registerForm) registerForm.addEventListener('submit', onRegister);
if (resetForm) resetForm.addEventListener('submit', onReset);
if (changePwdForm) changePwdForm.addEventListener('submit', onChangePassword);

// Link navigation
document.getElementById('signup-link').onclick = () => showScreen('register-screen');
document.getElementById('login-link').onclick = () => showScreen('login-screen');
document.getElementById('forgot-password-link').onclick = () => showScreen('reset-password-screen');
document.getElementById('back-to-login').onclick = () => showScreen('login-screen');

// Logout
document.getElementById('logout-btn').onclick = () => {
    sessionStorage.removeItem('br_token');
    showScreen('login-screen');
    document.getElementById('logout-btn').style.display = 'none';
};

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const isDark = document.body.classList.toggle('dark');
    setData(LS_KEYS.THEME, isDark ? 'dark' : 'light');
};

// Login handler
function onLogin(e) {
    e.preventDefault();
    const uname = loginForm.username.value.trim();
    const pwd = loginForm.password.value.trim();
    const users = getData(LS_KEYS.USERS);
    const user = users.find(u => u.username === uname && u.password === pwd && u.active);

    if (!user) {
        showToast('Invalid credentials or inactive user', 'error');
        return;
    }

    const token = generateJWT(user.username, user.role);
    sessionStorage.setItem('br_token', token);

    // Force password change if default
    if (user.mustChangePwd) {
        sessionStorage.setItem('pendingUser', user.username);
        showScreen('change-password-screen');
    } else {
        onAuthSuccess(user);
    }
}

function onAuthSuccess(user) {
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('settings-btn').style.display = 'inline-block';
    if (user.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'inline-block');
    }
    showToast('Welcome ' + user.name);
    showScreen('dashboard-screen');
}

// Registration handler
function onRegister(e) {
    e.preventDefault();
    const users = getData(LS_KEYS.USERS);
    const username = registerForm.username.value.trim();
    if (users.find(u => u.username === username)) {
        showToast('Username already exists', 'error');
        return;
    }
    const user = {
        name: registerForm.name.value.trim(),
        username,
        email: registerForm.email.value.trim(),
        password: registerForm.password.value.trim(),
        role: 'user',
        mustChangePwd: false,
        active: true
    };
    users.push(user);
    setData(LS_KEYS.USERS, users);
    showToast('Registration successful');
    showScreen('login-screen');
}

// Reset password handler (demo only)
function onReset(e) {
    e.preventDefault();
    const email = resetForm.email.value.trim();
    const users = getData(LS_KEYS.USERS);
    const user = users.find(u => u.email === email);
    if (!user) {
        showToast('Email not found', 'error');
        return;
    }
    showToast('Reset link sent to ' + email);
    showScreen('login-screen');
}

// Change default password handler
function onChangePassword(e) {
    e.preventDefault();
    const newPwd = changePwdForm.newPassword.value.trim();
    const confirmPwd = changePwdForm.confirmPassword.value.trim();
    if (newPwd.length < 6 || newPwd !== confirmPwd) {
        showToast('Passwords do not match or too short', 'error');
        return;
    }
    const pendingUser = sessionStorage.getItem('pendingUser');
    const users = getData(LS_KEYS.USERS);
    const user = users.find(u => u.username === pendingUser);
    if (user) {
        user.password = newPwd;
        user.mustChangePwd = false;
        setData(LS_KEYS.USERS, users);
        sessionStorage.removeItem('pendingUser');
        onAuthSuccess(user);
    } else {
        showToast('Unexpected error', 'error');
    }
}

// Attempt auto-login if token exists
(function autoLogin() {
    const token = sessionStorage.getItem('br_token');
    if (!token || isTokenExpired(token)) return;
    const payload = parseJWT(token);
    const users = getData(LS_KEYS.USERS);
    const user = users.find(u => u.username === payload.username);
    if (user) onAuthSuccess(user);
})();
