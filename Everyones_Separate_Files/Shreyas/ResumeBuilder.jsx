import React from 'react';

export const ResumePreview = ({ formData, template }) => {
    return (
        <div className={`resume-preview resume-${template}`}>
            {/* Header section */}
            <header>
                {/* ...existing header code... */}
            </header>

            {/* Main content with page break handling */}
            <main>
                {/* Professional Summary */}
                <section className="summary-section">
                    {/* ...existing summary code... */}
                </section>

                {/* Skills section - ensure it stays together */}
                <section className="skills-section">
                    {/* ...existing skills code... */}
                </section>

                {/* Add page break before experience if needed */}
                <div className="page-break"></div>

                {/* Work Experience */}
                <section className="experience-section">
                    {/* ...existing experience code... */}
                    {formData.experience && formData.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                            {/* ...existing experience item code... */}
                        </div>
                    ))}
                </section>

                {/* Education - potentially add page break */}
                <div className="page-break"></div>
                <section className="education-section">
                    {/* ...existing education code... */}
                </section>
            </main>
        </div>
    );
};