/**
 * @file workex-simple-template.js
 * @description Contains the template for simple work experience pages.
 */

/**
 * Generates the HTML for a simple work experience detail page.
 * @param {object} workItem - The work experience data object.
 * @returns {string} The complete HTML string for the page.
 */
export function createWorkexSimplePageHTML(workItem) {
    if (!workItem || !workItem.subpage) {
        return `<p class="text-center text-lg">Work experience details not found.</p>`;
    }

    const { company, role, subpage } = workItem;
    const { background, projectType, tools, location, years } = subpage;

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
                        <p class="sidebar-item-text">${projectType || 'N/A'}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Tools</h3>
                        <p class="sidebar-item-text">${tools ? tools.join(', ') : 'N/A'}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Location</h3>
                        <p class="sidebar-item-text">${location || 'N/A'}</p>
                    </div>
                    <div class="sidebar-item">
                        <h3 class="sidebar-item-title">Year</h3>
                        <p class="sidebar-item-text">${years || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div class="workex-detail-nav mt-16">
                <a href="#workex" class="router-link">← Back to all work</a>
            </div>
        </div>
    `;
}
