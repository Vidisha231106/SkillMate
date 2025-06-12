// This file will contain the React port of the Resume Builder app.
// The UI and logic will match the original static HTML/JS/CSS implementation.
// All features and styling will be preserved.

import React, { useState, useRef, useEffect } from 'react';
import './AppResume.css';
//import '../styles.css';
import './ResumePreview.css';

const STORAGE_KEY = 'resumeBuilderData';

const initialState = {
  name: '',
  title: '',
  contact: '',
  github: '',
  linkedin: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
  techSkills: '',
  projects: '',
  languages: '',
  certifications: '',
  opensource: '',
  additional: '',
  sections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    techSkills: true,
    projects: true,
    languages: true,
    certifications: true,
    opensource: true,
    additional: true,
  },
  font: 'calibri',
  template: 'modern',
};

function formatSection(text) {
  if (!text) return [];
  // Split by newlines and filter empty lines
  return text.split('\n').filter(line => line.trim());
}

function ProgressBar({ value }) {
  const percent = Math.min(100, Math.max(0, parseInt(value) || 70));
  return (
    <div className="progress-bar">
      <div className="progress-bar-inner" style={{ width: `${percent}%` }} />
    </div>
  );
}

function ResumePreview({ form }) {
  const content = {
    modern: (
      <div className="resume-modern">
        <header className="resume-header">
          <h1>{form.name}</h1>
          <h2>{form.title}</h2>
          <div>{form.contact}</div>
        </header>
        <div style={{ display: 'flex', width: '100%' }}>
          <aside className="sidebar">
            <section>
              <h3>Contact Information</h3>
              <p>{form.contact}</p>
            </section>
            {form.sections.skills && form.skills && (
              <section>
                <h3>Skills</h3>
                {form.skills.split(',').map((skill, i) => (
                  <div key={i} className="skill-row">
                    <div>{skill.trim()}</div>
                    <ProgressBar value={70 + Math.random() * 30} />
                  </div>
                ))}
              </section>
            )}
            {form.sections.languages && form.languages && (
              <section>
                <h3>Languages</h3>
                <ul>
                  {form.languages.split(',').map((lang, i) => (
                    <li key={i}>{lang.trim()}</li>
                  ))}
                </ul>
              </section>
            )}
            {form.sections.certifications && form.certifications && (
              <section>
                <h3>Certifications</h3>
                <ul>
                  {formatSection(form.certifications).map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
          <main className="main-content">
            {form.sections.summary && form.summary && (
              <section>
                <h3>Professional Summary</h3>
                {formatSection(form.summary).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </section>
            )}
            {form.sections.experience && form.experience && (
              <section>
                <h3>Work Experience</h3>
                {formatSection(form.experience).map((exp, i) => (
                  <p key={i}>{exp}</p>
                ))}
              </section>
            )}
            {form.sections.education && form.education && (
              <section>
                <h3>Education</h3>
                {formatSection(form.education).map((edu, i) => (
                  <p key={i}>{edu}</p>
                ))}
              </section>
            )}
            {form.sections.projects && form.projects && (
              <section>
                <h3>Projects / Achievements</h3>
                {formatSection(form.projects).map((proj, i) => (
                  <p key={i}>{proj}</p>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>
    ),
    traditional: (
      <div className="resume-traditional">
        <header className="resume-header">
          <h1>{form.name}</h1>
          {form.title && <h2>{form.title}</h2>}
          <div className="contact-info">
            {form.contact.split(',').map((info, i) => (
              <span key={i}>{info.trim()}</span>
            ))}
          </div>
        </header>
        {form.sections.summary && form.summary && (
          <section>
            <h3>Professional Summary</h3>
            {formatSection(form.summary).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}
        {form.sections.experience && form.experience && (
          <section>
            <h3>Professional Experience</h3>
            {formatSection(form.experience).map((exp, i) => (
              <p key={i}>{exp}</p>
            ))}
          </section>
        )}
        {form.sections.education && form.education && (
          <section>
            <h3>Education</h3>
            {formatSection(form.education).map((edu, i) => (
              <p key={i}>{edu}</p>
            ))}
          </section>
        )}
        {form.sections.skills && form.skills && (
          <section>
            <h3>Key Skills</h3>
            <ul>
              {form.skills.split(',').map((skill, i) => (
                <li key={i}>{skill.trim()}</li>
              ))}
            </ul>
          </section>
        )}
        {form.sections.certifications && form.certifications && (
          <section>
            <h3>Certifications</h3>
            <ul>
              {formatSection(form.certifications).map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
        {form.sections.additional && form.additional && (
          <section>
            <h3>Additional Achievements</h3>
            {formatSection(form.additional).map((info, i) => (
              <p key={i}>{info}</p>
            ))}
          </section>
        )}
      </div>
    ),
    technical: (
      <div className="resume-technical">
        <header className="resume-header">
          <h1>{form.name}</h1>
          <h2>{form.title}</h2>
          <div>{form.contact}</div>
          <div>
            {form.github && <span>GitHub: {form.github} </span>}
            {form.linkedin && <span>LinkedIn: {form.linkedin}</span>}
          </div>
        </header>
        {form.sections.techSkills && form.techSkills && (
          <section>
            <h3>Technical Skills Summary</h3>
            {formatSection(form.techSkills).map((skill, i) => (
              <p key={i}>{skill}</p>
            ))}
          </section>
        )}
        {form.sections.experience && form.experience && (
          <section>
            <h3>Professional Experience</h3>
            {formatSection(form.experience).map((exp, i) => (
              <p key={i}>{exp}</p>
            ))}
          </section>
        )}
        {form.sections.projects && form.projects && (
          <section>
            <h3>Technical Projects</h3>
            {formatSection(form.projects).map((proj, i) => (
              <p key={i}>{proj}</p>
            ))}
          </section>
        )}
        {form.sections.education && form.education && (
          <section>
            <h3>Education</h3>
            {formatSection(form.education).map((edu, i) => (
              <p key={i}>{edu}</p>
            ))}
          </section>
        )}
        {form.sections.opensource && form.opensource && (
          <section>
            <h3>Open Source Contributions</h3>
            {formatSection(form.opensource).map((contrib, i) => (
              <p key={i}>{contrib}</p>
            ))}
          </section>
        )}
      </div>
    ),
  };

  return content[form.template] || null;
}

function ResumeBuilder() {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });
  const previewRef = useRef(null);

  // Save to localStorage whenever form changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const handleInput = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSectionToggle = (e) => {
    const section = e.target.dataset.section;
    setForm(prev => ({
      ...prev,
      sections: { ...prev.sections, [section]: e.target.checked },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    alert('Resume data saved!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setForm(JSON.parse(saved));
      alert('Resume data loaded!');
    } else {
      alert('No saved data found.');
    }
  };

  return (
    <div className="container">
      <h1>Resume Builder</h1>
      <div className="controls">
        <label htmlFor="fontSelect">Font:</label>
        <select 
          id="fontSelect" 
          value={form.font} 
          onChange={e => setForm(prev => ({ ...prev, font: e.target.value }))
        }>
          <option value="calibri">Calibri</option>
          <option value="arial">Arial</option>
          <option value="helvetica">Helvetica</option>
          <option value="lato">Lato</option>
          <option value="cambria">Cambria</option>
          <option value="georgia">Georgia</option>
          <option value="garamond">Garamond</option>
        </select>
        <label htmlFor="templateSelect">Template:</label>
        <select 
          id="templateSelect" 
          value={form.template} 
          onChange={e => setForm(prev => ({ ...prev, template: e.target.value }))
        }>
          <option value="modern">Modern</option>
          <option value="traditional">Traditional</option>
          <option value="technical">Technical</option>
        </select>
        <button id="saveBtn" type="button" onClick={handleSave}>Save</button>
        <button id="loadBtn" type="button" onClick={handleLoad}>Load</button>
        <button id="printBtn" type="button" onClick={handlePrint}>Print / Export as PDF</button>
      </div>
      <form id="resumeForm" onSubmit={e => e.preventDefault()}>
        <fieldset>
          <legend>Header</legend>
          <input type="text" id="name" placeholder="Full Name" value={form.name} onChange={handleInput} required />
          <input type="text" id="title" placeholder="Title (e.g. Software Engineer)" value={form.title} onChange={handleInput} />
          <input type="text" id="contact" placeholder="Contact Info (Email, Phone)" value={form.contact} onChange={handleInput} />
          <input type="text" id="github" placeholder="GitHub (for Technical)" value={form.github} onChange={handleInput} />
          <input type="text" id="linkedin" placeholder="LinkedIn (for Technical)" value={form.linkedin} onChange={handleInput} />
        </fieldset>
        {Object.entries({
          summary: 'Professional Summary / Objective',
          experience: 'Work Experience',
          education: 'Education',
          skills: 'Skills',
          techSkills: 'Technical Skills Summary (for Technical)',
          projects: 'Projects / Achievements',
          languages: 'Languages',
          certifications: 'Certifications & Training',
          opensource: 'Open Source Contributions (for Technical)',
          additional: 'Additional Sections (Volunteer, Awards)',
        }).map(([key, label]) => (
          <fieldset key={key}>
            <label>
              <input
                type="checkbox"
                className="section-toggle"
                data-section={key}
                checked={form.sections[key]}
                onChange={handleSectionToggle}
              /> Include
            </label>
            <legend>{label}</legend>
            <textarea
              id={key}
              placeholder={label}
              value={form[key]}
              onChange={handleInput}
            />
          </fieldset>
        ))}
      </form>
      <div className="preview-container">
        <h2>Preview</h2>
        <div
          id="resumePreview"
          className="resume-preview"
          style={{ fontFamily: form.font }}
          ref={previewRef}
        >
          <ResumePreview form={form} />
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
