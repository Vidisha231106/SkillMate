// Font and template mapping
const fontMap = {
    calibri: 'font-calibri',
    arial: 'font-arial',
    helvetica: 'font-helvetica',
    lato: 'font-lato',
    cambria: 'font-cambria',
    georgia: 'font-georgia',
    garamond: 'font-garamond',
};

const form = document.getElementById('resumeForm');
const preview = document.getElementById('resumePreview');
const fontSelect = document.getElementById('fontSelect');
const templateSelect = document.getElementById('templateSelect');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const sectionToggles = document.querySelectorAll('.section-toggle');

function getSectionVisibility() {
    const visibility = {};
    sectionToggles.forEach(cb => {
        visibility[cb.dataset.section] = cb.checked;
    });
    return visibility;
}

function setSectionVisibility(visibility) {
    sectionToggles.forEach(cb => {
        if (visibility && typeof visibility[cb.dataset.section] !== 'undefined') {
            cb.checked = visibility[cb.dataset.section];
        }
    });
}

// Load data from localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
    Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key];
    });
    fontSelect.value = data.font || 'calibri';
    templateSelect.value = data.template || 'modern';
    setSectionVisibility(data.sectionVisibility || {});
    renderPreview();
}

// Save data to localStorage
function saveData() {
    const data = {};
    Array.from(form.elements).forEach(el => {
        if (el.id) data[el.id] = el.value;
    });
    data.font = fontSelect.value;
    data.template = templateSelect.value;
    data.sectionVisibility = getSectionVisibility();
    localStorage.setItem('resumeData', JSON.stringify(data));
}

// Render preview based on template, font, and section visibility
function renderPreview() {
    const data = {};
    Array.from(form.elements).forEach(el => {
        if (el.id) data[el.id] = el.value;
    });
    const fontClass = fontMap[fontSelect.value] || 'font-calibri';
    const template = templateSelect.value;
    const sectionVisibility = getSectionVisibility();
    let innerHtml = '';
    if (template === 'modern') {
        innerHtml = `
        <div class="template-modern ${fontClass}">
            <div class="sidebar">
                <h2>Contact</h2>
                <div>${data.contact || ''}</div>
                ${sectionVisibility.skills ? `<h3>Skills</h3>
                ${(data.skills || '').split(',').map(skill => skill.trim() ? `<div>${skill}<div class='progress-bar'><div class='progress' style='width:80%'></div></div></div>` : '').join('')}` : ''}
                ${sectionVisibility.languages ? `<h3>Languages</h3>
                <div>${(data.languages || '').split(',').map(l => `<div>${l.trim()}</div>`).join('')}</div>` : ''}
                ${sectionVisibility.certifications ? `<h3>Certifications</h3>
                <div>${(data.certifications || '').replace(/\n/g, '<br>')}</div>` : ''}
            </div>
            <div class="main-content">
                <div style="border-bottom:2px solid #4a90e2; margin-bottom:20px;">
                    <h1 style="margin:0;">${data.name || ''}</h1>
                    <div style="font-size:1.2em; color:#555;">${data.title || ''}</div>
                    <div style="color:#888;">${data.contact || ''}</div>
                </div>
                ${sectionVisibility.summary ? `<h2>Professional Summary</h2>
                <div>${(data.summary || '').replace(/\n/g, '<br>')}</div>` : ''}
                ${sectionVisibility.experience ? `<h2>Work Experience</h2>
                <div>${(data.experience || '').replace(/\n/g, '<br>')}</div>` : ''}
                ${sectionVisibility.education ? `<h2>Education</h2>
                <div>${(data.education || '').replace(/\n/g, '<br>')}</div>` : ''}
                ${sectionVisibility.projects ? `<h2>Projects/Achievements</h2>
                <div>${(data.projects || '').replace(/\n/g, '<br>')}</div>` : ''}
            </div>
        </div>
        `;
    } else if (template === 'traditional') {
        innerHtml = `
        <div class="template-traditional ${fontClass}">
            <div class="header">
                <h1>${data.name || ''}</h1>
                <div>${data.contact || ''}</div>
            </div>
            ${sectionVisibility.summary ? `<h2>Professional Summary / Objective</h2>
            <div>${(data.summary || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.experience ? `<h2>Work Experience</h2>
            <div>${(data.experience || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.education ? `<h2>Education</h2>
            <div>${(data.education || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.skills ? `<h2>Skills</h2>
            <div>${(data.skills || '').split(',').map(skill => `<span>${skill.trim()}</span>`).join(', ')}</div>` : ''}
            ${sectionVisibility.certifications ? `<h2>Certifications</h2>
            <div>${(data.certifications || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.additional ? `<h2>Additional</h2>
            <div>${(data.additional || '').replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        `;
    } else if (template === 'technical') {
        innerHtml = `
        <div class="template-technical ${fontClass}">
            <div class="header">
                <div>
                    <h1 style="margin:0;">${data.name || ''}</h1>
                    <div style="font-size:1.1em; color:#555;">${data.title || ''}</div>
                </div>
                <div class="links">
                    ${data.github ? `<span>GitHub: ${data.github}</span><br>` : ''}
                    ${data.linkedin ? `<span>LinkedIn: ${data.linkedin}</span>` : ''}
                </div>
            </div>
            ${sectionVisibility.techSkills ? `<h2>Technical Skills Summary</h2>
            <div>${(data.techSkills || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.experience ? `<h2>Professional Experience</h2>
            <div>${(data.experience || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.projects ? `<h2>Technical Projects</h2>
            <div>${(data.projects || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.education ? `<h2>Education</h2>
            <div>${(data.education || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.certifications ? `<h2>Certifications & Training</h2>
            <div>${(data.certifications || '').replace(/\n/g, '<br>')}</div>` : ''}
            ${sectionVisibility.opensource ? `<h2>Open Source Contributions</h2>
            <div>${(data.opensource || '').replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        `;
    }
    preview.innerHTML = `<div class='a4-page'>${innerHtml}</div>`;
}

// Event listeners
form.addEventListener('input', () => {
    renderPreview();
    saveData();
});
fontSelect.addEventListener('change', () => {
    renderPreview();
    saveData();
});
templateSelect.addEventListener('change', () => {
    renderPreview();
    saveData();
});
sectionToggles.forEach(cb => {
    cb.addEventListener('change', () => {
        renderPreview();
        saveData();
    });
});
saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveData();
    alert('Resume data saved!');
});
loadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadData();
    alert('Resume data loaded!');
});

// Initial load
window.onload = () => {
    loadData();
    renderPreview();
};

document.getElementById('printBtn').addEventListener('click', function() {
    window.print();
}); 