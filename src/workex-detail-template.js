/**
 * @file workex-detail-template.js
 * @description The one detail-page template for every work experience entry.
 *
 * This previously existed three times over: a Boston College copy, a
 * near-identical ZS copy differing only in video filename, and a "simple"
 * fallback whose classes had no CSS at all, so any role using it rendered
 * unstyled. Media now comes from the data, so every role gets the same layout.
 */

/** Renders **bold** and paragraph breaks from the authored content strings. */
const renderContent = (content) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');

export function createWorkexDetailPageHTML(workItem) {
    if (!workItem || !workItem.subpage) {
        return `<p class="text-center text-lg text-white">Work experience details not found.</p>`;
    }

    const { company, role, date, subpage } = workItem;
    const { projectType, tools, location, years, sections = [], media } = subpage;

    const navLinksHTML = sections.map((section, index) => `
        <li><a href="#section-${index}" class="workex-v-nav-link">${section.title}</a></li>
    `).join('');

    const sectionsHTML = sections.map((section, index) => `
        <div id="section-${index}" class="workex-v-section">
            <div class="workex-v-content-box">
                <h3 class="workex-v-content-title">${section.title}</h3>
                <div class="workex-v-content-text">${renderContent(section.content)}</div>
            </div>
        </div>
    `).join('');

    // Tool lists run long, so they get their own full-width band of pills below
    // the header rather than being crammed into a narrow meta column.
    const toolsHTML = tools.map((tool) => `<li class="meta-tool">${tool}</li>`).join('');

    // Roles without a video simply omit the media block rather than falling
    // back to a differently-shaped layout.
    const mediaHTML = media ? `
            <div class="workex-v-media-container">
                <video class="workex-v-video" src="${media.video}" autoplay muted playsinline></video>
                <img class="workex-v-logo hidden" src="${media.logo}" alt="${media.alt}">
            </div>
    ` : '';

    return `
        <div class="workex-detail-v2-container">
            <div class="workex-v-header">
                <div class="workex-v-header-main">
                    <p class="workex-v-company">${company}</p>
                    <h1 class="workex-v-role">${role}</h1>
                </div>
                <div class="workex-v-header-meta">
                    <div class="meta-item"><span>Project Type</span><p>${projectType}</p></div>
                    <div class="meta-item"><span>Location</span><p>${location}</p></div>
                    <div class="meta-item"><span>Year</span><p>${years || date}</p></div>
                </div>
            </div>
            <div class="workex-v-tools">
                <span class="workex-v-tools-label">Tools &amp; Skills</span>
                <ul class="meta-tools">${toolsHTML}</ul>
            </div>
            ${mediaHTML}
            <div class="workex-v-body">
                <nav class="workex-v-nav">
                    <ul>${navLinksHTML}</ul>
                </nav>
                <div class="workex-v-content">${sectionsHTML}</div>
            </div>
            <div class="workex-detail-nav-v2">
                <a href="/workex" class="router-link">&larr; Back to all work</a>
            </div>
        </div>
    `;
}
