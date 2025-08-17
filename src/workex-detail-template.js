/**
 * @file workex-detail-template.js
 * @description Contains the template function for rendering a work experience detail page.
 */

/**
 * Generates the HTML for a single work experience detail page.
 * @param {object} workItem - The work experience data object.
 * @returns {string} The complete HTML string for the page.
 */
export function createWorkexDetailPageHTML(workItem) {
    if (!workItem || !workItem.subpage) {
        return `<p class="text-center text-lg">Work experience details not found.</p>`;
    }

    const { company, role, subpage } = workItem;
    const { background, projectType, tools, location, years, keyPoints, motto } = subpage;

    // Generate the HTML for the key point buttons
    const keyPointsHTML = keyPoints.map((point, index) => `
        <div class="key-point-card pattern-${index + 1}">
            <h4 class="key-point-title">${point.title}</h4>
            <p class="key-point-description">${point.description}</p>
            <span class="key-point-skill">${point.skill}</span>
        </div>
    `).join('');

    // UPDATED: Added the specific 'bc-motto-container' class
    const mottoHTML = motto ? `
        <div class="workex-motto-container bc-motto-container">
            <p>${motto}</p>
        </div>
    ` : '';

    return `
        <div class="workex-detail-container container mx-auto px-6 py-16 md:py-24">
            <div class="grid md:grid-cols-3 gap-12">
                <div class="md:col-span-2 workex-detail-main">
                    <p class="workex-detail-company">${company}</p>
                    <h1 class="workex-detail-title">${role}</h1>
                    <p class="workex-detail-background">${background}</p>
                </div>
                <div class="workex-detail-sidebar">
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Project Type</h3>
                        <p class="sidebar-item-text">${projectType}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Tools</h3>
                        <p class="sidebar-item-text">${tools.join(', ')}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Location</h3>
                        <p class="sidebar-item-text">${location}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Year</h3>
                        <p class="sidebar-item-text">${years}</p>
                    </div>
                </div>
            </div>

            <div class="workex-brand-screen">
                <img src="./public/images/bc-logo.png" alt="Boston College Logo" class="brand-screen-icon">
            </div>
            <div class="workex-key-points">
                ${keyPointsHTML}
            </div>

            ${mottoHTML}

            <div class="workex-detail-nav">
                <a href="#workex" class="router-link">← Back to all work</a>
            </div>
        </div>
    `;
}
