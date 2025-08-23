/**
 * @file bfin-detail-template.js
 * @description Contains the template function for rendering the BFIN detail page.
 */

/**
 * Generates the HTML for the BFIN detail page.
 * @param {object} workItem - The work experience data object.
 * @returns {string} The complete HTML string for the page.
 */
export function createBfinDetailPageHTML(workItem) {
    if (!workItem || !workItem.subpage) {
        return `<p class="text-center text-lg text-white">Work experience details not found.</p>`;
    }

    const { company, role, subpage } = workItem;
    const { projectType, tools, location, years, sections } = subpage;

    // Generate the left-side navigation links
    const navLinksHTML = sections.map((section, index) => `
        <li>
            <a href="#section-${index}" class="workex-v-nav-link">${section.title}</a>
        </li>
    `).join('');

    // Generate the right-side content sections
    const sectionsHTML = sections.map((section, index) => {
        // Process content to handle markdown bolding and newlines
        const processedContent = section.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `
            <div id="section-${index}" class="workex-v-section">
                <div class="workex-v-content-box">
                    <h3 class="workex-v-content-title">${section.title}</h3>
                    <div class="workex-v-content-text">
                        <p>${processedContent}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="workex-detail-v2-container">
            <div class="workex-v-header">
                <div class="workex-v-header-main">
                    <p class="workex-v-company">${company}</p>
                    <h1 class="workex-v-role">${role}</h1>
                </div>
                <div class="workex-v-header-meta">
                    <div class="meta-item"><span>Project Type</span><p>${projectType}</p></div>
                    <div class="meta-item"><span>Tools</span><p>${tools.join(', ')}</p></div>
                    <div class="meta-item"><span>Location</span><p>${location}</p></div>
                    <div class="meta-item"><span>Year</span><p>${years}</p></div>
                </div>
            </div>

            <div class="workex-v-media-container">
                <img id="bfin-workex-logo" src="./public/images/b-logo.jpg" alt="BFIN Logo">
            </div>

            <div class="workex-v-body">
                <nav class="workex-v-nav">
                    <ul>
                        ${navLinksHTML}
                    </ul>
                </nav>
                <div class="workex-v-content">
                    ${sectionsHTML}
                </div>
            </div>
             <div class="workex-detail-nav-v2">
                <a href="#workex" class="router-link">← Back to all work</a>
            </div>
        </div>
    `;
}
