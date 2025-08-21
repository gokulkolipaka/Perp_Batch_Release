// utils.js - Utility helper functions

// LocalStorage helpers
export const LS_KEYS = {
    USERS: 'br_users',
    BATCHES: 'br_batches',
    THEME: 'br_theme'
};

export function getData(key, fallback = []) {
    const raw = localStorage.getItem(key);
    try {
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error('Corrupted LocalStorage data for', key);
        return fallback;
    }
}

export function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Toast notifications
export function showToast(message, type = 'success', timeout = 3000) {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), timeout);
}

// Screen management
export function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// JWT (mock) generation & validation (for demo only)
export function generateJWT(username, role) {
    const payload = { username, role, ts: Date.now() };
    return btoa(JSON.stringify(payload));
}

export function parseJWT(token) {
    try {
        return JSON.parse(atob(token));
    } catch { return null; }
}

export function isTokenExpired(token, expiryMinutes = 60) {
    const payload = parseJWT(token);
    if (!payload) return true;
    return (Date.now() - payload.ts) > expiryMinutes * 60 * 1000;
}

// Dark mode toggle
export function setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    setData(LS_KEYS.THEME, theme);
}

export function initTheme() {
    const saved = localStorage.getItem(LS_KEYS.THEME) || 'light';
    setTheme(saved);
}
