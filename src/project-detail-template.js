/**
 * @file project-detail-template.js
 * @description Contains the template function for rendering a project detail page.
 */

/**
 * Generates the HTML for a single project detail page.
 * @param {object} projectItem - The project data object.
 * @returns {string} The complete HTML string for the page.
 */
export function createProjectDetailPageHTML(projectItem) {
    if (!projectItem || !projectItem.subpage) {
        return `<p class="text-center text-lg text-white">Project details not found.</p>`;
    }

    const { title, subpage } = projectItem;
    const { sections, documents } = subpage;

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
    
    // Generate the document buttons
    const docButtonsHTML = documents.map(doc => 
        `<a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn text-sm mt-2 mr-2">${doc.name}</a>`
    ).join('');

    return `
        <div class="workex-detail-v2-container">
            <div class="workex-v-header">
                <div class="workex-v-header-main">
                    <h1 class="workex-v-role">${title}</h1>
                </div>
            </div>

            <div class="workex-v-body">
                <nav class="workex-v-nav">
                    <ul>
                        ${navLinksHTML}
                    </ul>
                </nav>
                <div class="workex-v-content">
                    ${sectionsHTML}
                    <div class="project-assets mt-8">
                        ${docButtonsHTML}
                    </div>
                </div>
            </div>
             <div class="workex-detail-nav-v2">
                <a href="#projects" class="router-link">← Back to all projects</a>
            </div>
        </div>
    `;
}
