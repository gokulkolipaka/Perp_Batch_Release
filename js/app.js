// app.js - Core application orchestrator
import { LS_KEYS, getData, setData, showScreen, showToast } from './utils.js';
import { initDocumentGrid } from './bmr.js';
import './compliance.js';

// Navigation actions
const newBatchBtn = document.getElementById('new-batch-btn');
const viewBatchesBtn = document.getElementById('view-batches-btn');
const userMgmtBtn = document.getElementById('user-management-btn');
const cancelBatchBtn = document.getElementById('cancel-batch-btn');
const saveDraftBtn = document.getElementById('save-draft-btn');

if (newBatchBtn) newBatchBtn.onclick = () => {
    initDocumentGrid();
    showScreen('batch-creation-screen');
};
if (viewBatchesBtn) viewBatchesBtn.onclick = () => showScreen('batch-list-screen');
if (userMgmtBtn) userMgmtBtn.onclick = () => {
    populateUserTable();
    showScreen('user-management-screen');
};
if (cancelBatchBtn) cancelBatchBtn.onclick = () => showScreen('dashboard-screen');
if (saveDraftBtn) saveDraftBtn.onclick = saveDraftBatch;

// Batch saving
function saveDraftBatch() {
    const batches = getData(LS_KEYS.BATCHES);
    const batchNumber = document.getElementById('batch-number').value.trim();
    if (!batchNumber) {
        showToast('Batch number required', 'error');
        return;
    }
    batches.push({ batchNumber, status: 'draft', created: new Date().toISOString() });
    setData(LS_KEYS.BATCHES, batches);
    showToast('Draft saved');
    showScreen('dashboard-screen');
    updateStats();
}

// Dashboard stats
function updateStats() {
    const batches = getData(LS_KEYS.BATCHES);
    document.getElementById('pending-batches').innerText = batches.filter(b => b.status === 'pending').length;
    document.getElementById('approved-batches').innerText = batches.filter(b => b.status === 'approved').length;
    document.getElementById('rejected-batches').innerText = batches.filter(b => b.status === 'rejected').length;
}
updateStats();

// User management
function populateUserTable() {
    const users = getData(LS_KEYS.USERS);
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';
    users.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.name}</td>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>${u.active ? 'Active' : 'Inactive'}</td>
            <td><button class="btn btn-secondary" data-idx="${idx}">Edit</button></td>`;
        tbody.appendChild(tr);
    });
}
