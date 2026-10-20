/**
 * @file charts.js
 * @description SVG figures drawn from real numbers in content.js. Pure string
 * builders, so the prerenderer and the browser produce identical markup.
 *
 * Colors come from CSS (currentColor and classes), never literals, so the same
 * figure works on paper and on the dark ink panels.
 */

/**
 * Answer-sheet bubbles: `count` ovals, of which `to` are filled at rest.
 */
export function bubblesSVG({ count, to }) {
    const rows = Math.max(2, Math.round(Math.sqrt(count / 6)));
    const cols = Math.ceil(count / rows);
    const dx = 26, dy = 22, rx = 9, ry = 6.5;
    const w = cols * dx, h = rows * dy;
    let marks = '';
    for (let i = 0; i < count; i++) {
        const x = (i % cols) * dx + dx / 2;
        const y = Math.floor(i / cols) * dy + dy / 2;
        marks += `<ellipse class="bubble${i < to ? ' is-on' : ''}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
    }
    return `<svg class="bubbles" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true" preserveAspectRatio="xMinYMin meet">${marks}</svg>`;
}

/**
 * Horizontal percentage bars, built in HTML rather than SVG so the labels
 * reflow and stay readable at phone width instead of scaling down with the
 * drawing. Screen readers get one sentence with every value.
 */
function barsHTML({ heading, bars, note }) {
    const summary = `${heading}. ${bars.map((b) => `${b.label}: ${b.display}`).join('. ')}.${note ? ` ${note}` : ''}`;
    return `
        <div class="chart" role="img" aria-label="${summary}">
            <p class="ch-heading" aria-hidden="true">${heading}</p>
            ${bars.map((b) => `
            <div class="ch-row" aria-hidden="true">
                <p class="ch-label">${b.label}</p>
                <div class="ch-bar">
                    <span class="ch-track"><span class="ch-fill${b.muted ? ' is-muted' : ''}" style="width:${Math.max(0.6, b.value)}%"></span></span>
                    <span class="ch-value">${b.display}</span>
                </div>
            </div>`).join('')}
            ${note ? `<p class="ch-note" aria-hidden="true">${note}</p>` : ''}
        </div>`;
}

const CHARTS = {
    audit: () => barsHTML({
        heading: '12,804 item pairs, each judged in both orders',
        bars: [
            { label: 'Judgments that flipped when the order was reversed', value: 11.06, display: '11.06%' },
            { label: 'Observed intransitivity found among those unstable judgments', value: 95, display: '~95%' },
        ],
        note: 'Filtering them out gave near-perfect transitivity, and no gain in validity.',
    }),
    network: () => barsHTML({
        heading: '1,351 Bradley-Terry fits over 28 network designs',
        bars: [
            { label: 'Comparison budget used by the sparse network', value: 22, display: '22%' },
            { label: 'Rank correlation it kept', value: 98, display: '98%' },
        ],
        note: 'The same estimates were badly overdispersed.',
    }),
    safety: () => barsHTML({
        heading: 'Vending-Bench Mini, Gemma-4 26B, share of trials ending out of business',
        bars: [
            { label: 'Abliterated model', value: 100, display: 'every trial' },
            { label: 'Stock model', value: 50, display: '~50%', muted: true },
        ],
    }),
    pending: () => `
        <div class="pending">
            ${bubblesSVG({ count: 24, to: 0 })}
            <p class="pending-note">No results yet</p>
        </div>`,
};

/** Small-size stand-ins for the directory hover preview, where full charts are too fine to read. */
const PREVIEWS = {
    audit: { big: '11.06%', text: 'of judgments flipped when the pair order was reversed' },
    network: { big: '22% → 98%', text: 'A fifth of the comparison budget kept 98% of rank correlation' },
    safety: { big: 'every trial', text: 'The abliterated model went out of business every time; the stock model, about half' },
};

export function previewHTML(figure) {
    if (figure?.image) return `<img src="${figure.image}" alt="" loading="lazy" decoding="async">`;
    const p = PREVIEWS[figure?.chart];
    if (!p) return figureHTML(figure);
    return `<div class="pv-stat"><span class="pv-big">${p.big}</span><span class="pv-text">${p.text}</span></div>`;
}

/** Renders a research figure: a named chart or an image. */
export function figureHTML(figure, alt = '') {
    if (!figure) return '';
    if (figure.image) {
        return `<img src="${figure.image}" alt="${figure.alt || alt}" loading="lazy" decoding="async">`;
    }
    const build = CHARTS[figure.chart];
    if (!build) throw new Error(`charts: unknown chart "${figure.chart}"`);
    return build();
}
