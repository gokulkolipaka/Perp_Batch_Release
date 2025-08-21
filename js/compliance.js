// bmr.js - Digital BMR integration
import { showToast } from './utils.js';

const documentTypes = [
    'Batch Manufacturing Record (BMR)',
    'Certificate of Analysis (COA)',
    'Laboratory Control Records',
    'Raw Material Records',
    'Packaging Material Records',
    'Deviation Reports (OOS/OOT/Change Control)',
    'Equipment & Facility Records',
    'Packaging & Labelling Records',
    'QC & QA Reviews',
    'Regulatory & Compliance Records'
];

// Populate document upload grid
export function initDocumentGrid() {
    const grid = document.getElementById('document-upload-grid');
    grid.innerHTML = '';
    documentTypes.forEach(type => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML = `
            <label class="doc-label">${type}</label>
            <input type="file" class="doc-input" data-type="${type}">
            <label class="na-label"><input type="checkbox" class="na-checkbox" data-type="${type}"> N/A</label>
        `;
        grid.appendChild(card);
    });
}

// Collect uploaded documents
export function getUploadedDocs() {
    const docs = {};
    document.querySelectorAll('.doc-input').forEach(inp => {
        const type = inp.dataset.type;
        if (inp.files.length) {
            docs[type] = { fileName: inp.files[0].name, status: 'uploaded' };
        }
    });
    document.querySelectorAll('.na-checkbox').forEach(chk => {
        if (chk.checked) {
            docs[chk.dataset.type] = { status: 'na' };
        }
    });
    return docs;
}

// Load BMR template (static demo)
export function loadBMRTemplate() {
    const btn = document.getElementById('load-bmr-template');
    btn.disabled = true;
    const container = document.getElementById('bmr-content');
    container.style.display = 'block';
    container.innerHTML = `<iframe src="bmr-digital-app.html" style="width:100%;height:400px;border:1px solid #ccc;"></iframe>`;
    showToast('BMR template loaded');
}

// Init listeners
(function init() {
    const btn = document.getElementById('load-bmr-template');
    if (btn) btn.addEventListener('click', loadBMRTemplate);
    initDocumentGrid();
})();
