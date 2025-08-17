/**
 * @file zs-detail-template.js
 * @description Contains the template function for rendering the ZS Associates detail page.
 */

/**
 * Generates the HTML for the ZS Associates detail page.
 * @param {object} workItem - The work experience data object.
 * @returns {string} The complete HTML string for the page.
 */
export function createZsDetailPageHTML(workItem) {
    if (!workItem || !workItem.subpage) {
        return `<p class="text-center text-lg">Work experience details not found.</p>`;
    }

    const { company, role, subpage } = workItem;
    const { background, projectType, tools, location, years, keyPoints, motto } = subpage;

    // Generate the HTML for the key point containers
    const keyPointsHTML = keyPoints.map((point, index) => `
        <div class="key-point-card-zs zs-pattern-${index + 1}">
            <h4 class="key-point-title-zs">${point.title}</h4>
            <div class="key-point-content-zs">
                <p><strong>Challenge:</strong> ${point.challenge}</p>
                <p><strong>My Solution:</strong> ${point.solution}</p>
                ${point.impact ? `<p><strong>Impact:</strong> ${point.impact}</p>` : ''}
            </div>
            <span class="key-point-skill-zs"><strong>Skills/Tools Used:</strong> ${point.skills}</span>
        </div>
    `).join('');

    const mottoHTML = motto ? `
        <div class="workex-motto-container zs-motto-container">
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

            <div class="workex-brand-screen zs-brand-screen">
                <img src="./public/images/zs-logo.png" alt="ZS Associates Logo" class="brand-screen-icon">
            </div>
            
            <div class="workex-key-points-zs">
                ${keyPointsHTML}
            </div>

            ${mottoHTML}

            <div class="workex-detail-nav">
                <a href="#workex" class="router-link">← Back to all work</a>
            </div>
        </div>
    `;
}
