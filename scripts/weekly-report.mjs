/**
 * @file weekly-report.mjs
 * @description Emails a weekly summary of the site's Vercel Web Analytics.
 * Run by .github/workflows/weekly-report.yml every Monday morning (Boston time).
 *
 * Environment:
 *   VERCEL_TOKEN        Vercel access token (read access is enough)
 *   GMAIL_APP_PASSWORD  App password for the sending Gmail account
 *   REPORT_EMAIL        Recipient and sender (defaults to the site owner)
 *   VERCEL_PROJECT      Optional project id or name; found automatically if unset
 *
 * Flags:
 *   --dry-run   Build the email and write it to ./weekly-report-preview.html
 *               instead of sending. Uses sample data if no token is set.
 *
 * The repository is public, and so are its Actions logs. This script therefore
 * never prints traffic numbers, countries or pages; it reports only success or
 * the kind of failure.
 */

import { writeFile } from 'node:fs/promises';

const DRY_RUN = process.argv.includes('--dry-run');
const TO = process.env.REPORT_EMAIL || 'vinithhazard@gmail.com';
const TOKEN = process.env.VERCEL_TOKEN;
const API = 'https://api.vercel.com';
const SITE = 'https://vin-ayapilla-portfolio.vercel.app';
const REPO = { org: 'vinzard11', name: 'portfolio-website' };

/* --------------------------------------------------------------- dates */

const DAY = 86400000;
const startOfUtcDay = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const iso = (d) => d.toISOString().slice(0, 10);

// The seven full days before today, and the seven before that for comparison.
const today = startOfUtcDay(new Date());
const week = { since: new Date(today - 7 * DAY), until: new Date(today - 1) };
const prior = { since: new Date(today - 14 * DAY), until: new Date(today - 7 * DAY - 1) };

/* ----------------------------------------------------------------- api */

async function api(path, params = {}) {
    const url = new URL(API + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, v);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) {
        // Status only: response bodies can echo request details into the public log.
        throw new Error(`Vercel API ${path} returned HTTP ${res.status}`);
    }
    return res.json();
}

async function findProject() {
    if (process.env.VERCEL_PROJECT) return process.env.VERCEL_PROJECT;
    const { projects = [] } = await api('/v9/projects', { limit: 100 });
    const match = projects.find((p) => p.link?.org === REPO.org && p.link?.repo === REPO.name)
        || projects.find((p) => p.name === REPO.name || p.name === 'vin-ayapilla-portfolio');
    if (!match) throw new Error('Could not find the Vercel project for this repository; set VERCEL_PROJECT');
    return match.id;
}

const count = (projectId, range) => api('/v1/query/web-analytics/visits/count', {
    projectId, since: range.since.toISOString(), until: range.until.toISOString(),
}).then((r) => r.data || { pageviews: 0, visitors: 0 });

const top = (projectId, by, limit) => api('/v1/query/web-analytics/visits/aggregate', {
    projectId, by, limit, since: iso(week.since), until: iso(week.until),
}).then((r) => r.data || []);

async function liveData() {
    const projectId = await findProject();
    const [thisWeek, lastWeek, countries, pages, referrers, devices, days] = await Promise.all([
        count(projectId, week),
        count(projectId, prior),
        top(projectId, 'country', 10),
        top(projectId, 'requestPath', 10),
        top(projectId, 'referrerHostname', 8),
        top(projectId, 'deviceType', 5),
        top(projectId, 'day', 7),
    ]);
    return { thisWeek, lastWeek, countries, pages, referrers, devices, days };
}

/** Clearly fake numbers, used only for --dry-run without a token. */
function sampleData() {
    return {
        sample: true,
        thisWeek: { pageviews: 214, visitors: 87 },
        lastWeek: { pageviews: 160, visitors: 71 },
        countries: [{ country: 'US', visitors: 41, pageviews: 102 }, { country: 'IN', visitors: 19, pageviews: 44 }, { country: 'GB', visitors: 9, pageviews: 21 }, { country: 'DE', visitors: 6, pageviews: 15 }],
        pages: [{ requestPath: '/', visitors: 70, pageviews: 81 }, { requestPath: '/research', visitors: 33, pageviews: 40 }, { requestPath: '/experience', visitors: 25, pageviews: 29 }, { requestPath: '/research/auditing-llm-comparative-judges', visitors: 12, pageviews: 14 }],
        referrers: [{ referrerHostname: 'linkedin.com', visitors: 30, pageviews: 0 }, { referrerHostname: 'google.com', visitors: 11, pageviews: 0 }],
        devices: [{ deviceType: 'desktop', visitors: 58 }, { deviceType: 'mobile', visitors: 29 }],
        days: [3, 8, 22, 15, 11, 19, 9].map((v, i) => ({ timestamp: new Date(week.since.getTime() + i * DAY).toISOString(), visitors: v, pageviews: v * 2 })),
    };
}

/* --------------------------------------------------------------- email */

const C = { paper: '#e6efe7', paper2: '#dce8de', ink: '#1f2523', ink2: '#47534f', red: '#b3261e', green: '#3d6b57', rule: '#a9c4b3' };
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
const countryName = (code) => { try { return code && code.length === 2 ? regionName.of(code) : (code || 'Unknown'); } catch { return code; } };
const fmt = (n) => Number(n || 0).toLocaleString('en-US');
const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

function change(now, before) {
    if (!before) return now ? 'new this week' : 'no change';
    const pct = Math.round(((now - before) / before) * 100);
    return pct === 0 ? 'same as last week' : `${pct > 0 ? '+' : ''}${pct}% vs last week`;
}

function table(title, rows, label) {
    if (!rows.length) return '';
    const max = Math.max(...rows.map((r) => r.visitors || 0), 1);
    return `
      <h2 style="font:600 15px/1.3 Helvetica,Arial,sans-serif;margin:28px 0 10px;color:${C.ink}">${title}</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font:14px/1.4 Helvetica,Arial,sans-serif;color:${C.ink}">
        ${rows.map((r) => `
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid ${C.rule};width:46%">${esc(label(r))}</td>
            <td style="padding:7px 12px;border-bottom:1px solid ${C.rule}">
              <div style="height:8px;background:${C.paper2};border-radius:2px"><div style="height:8px;width:${Math.round((r.visitors || 0) / max * 100)}%;background:${C.red};border-radius:2px"></div></div>
            </td>
            <td style="padding:7px 0;border-bottom:1px solid ${C.rule};text-align:right;font-family:Menlo,monospace;white-space:nowrap">${fmt(r.visitors)}</td>
          </tr>`).join('')}
      </table>`;
}

function buildEmail(d) {
    const range = `${fmtDate(week.since)} to ${fmtDate(week.until)}`;
    const quiet = !d.thisWeek.pageviews;
    const dayMax = Math.max(...d.days.map((x) => x.visitors || 0), 1);
    const dayBars = d.days.map((x) => {
        const h = Math.max(2, Math.round((x.visitors || 0) / dayMax * 56));
        const label = new Date(x.timestamp).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).slice(0, 2);
        return `<td valign="bottom" align="center" style="padding:0 3px;font:11px Menlo,monospace;color:${C.ink2}">
            <div style="height:${h}px;width:22px;background:${C.ink};border-radius:2px;margin:0 auto 6px"></div>${label}</td>`;
    }).join('');

    const subject = quiet
        ? `Portfolio: no visits ${range}`
        : `Portfolio: ${fmt(d.thisWeek.visitors)} visitors, ${range}`;

    const html = `<!doctype html><html><body style="margin:0;background:${C.paper}">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:${C.paper};color:${C.ink}">
      ${d.sample ? `<p style="font:12px Menlo,monospace;color:${C.red};margin:0 0 16px">SAMPLE DATA: preview only</p>` : ''}
      <p style="font:12px/1 Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:${C.green};margin:0">Weekly report · ${esc(range)}</p>
      <h1 style="font:italic 400 34px/1.1 Georgia,serif;margin:10px 0 22px">vin-ayapilla-portfolio</h1>
      ${quiet ? `<p style="font:15px/1.6 Helvetica,Arial,sans-serif">No visits were recorded this week.</p>` : `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="padding:16px;background:${C.paper2};border-radius:10px;width:50%">
          <div style="font:italic 400 40px/1 Georgia,serif">${fmt(d.thisWeek.visitors)}</div>
          <div style="font:13px Helvetica,Arial,sans-serif;color:${C.ink2};margin-top:6px">visitors · ${esc(change(d.thisWeek.visitors, d.lastWeek.visitors))}</div>
        </td><td style="width:12px"></td>
        <td style="padding:16px;background:${C.paper2};border-radius:10px;width:50%">
          <div style="font:italic 400 40px/1 Georgia,serif">${fmt(d.thisWeek.pageviews)}</div>
          <div style="font:13px Helvetica,Arial,sans-serif;color:${C.ink2};margin-top:6px">page views · ${esc(change(d.thisWeek.pageviews, d.lastWeek.pageviews))}</div>
        </td></tr></table>
      <h2 style="font:600 15px/1.3 Helvetica,Arial,sans-serif;margin:28px 0 10px">Visitors by day</h2>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>${dayBars}</tr></table>
      ${table('Where visitors are', d.countries, (r) => countryName(r.country))}
      ${table('Top pages', d.pages, (r) => (r.requestPath === '/' ? 'Home' : r.requestPath))}
      ${table('How they found the site', d.referrers.filter((r) => r.referrerHostname), (r) => r.referrerHostname)}
      ${table('Devices', d.devices, (r) => r.deviceType ? r.deviceType[0].toUpperCase() + r.deviceType.slice(1) : 'Unknown')}`}
      <p style="font:13px/1.6 Helvetica,Arial,sans-serif;color:${C.ink2};margin-top:32px;border-top:1px solid ${C.rule};padding-top:16px">
        Counts are unique visitors from Vercel Web Analytics, cookieless and country-level only.
        Full dashboard: Vercel, your project, Analytics. Site: <a href="${SITE}" style="color:${C.ink}">${SITE.replace('https://', '')}</a>
      </p>
    </div></body></html>`;

    const text = quiet ? `No visits were recorded ${range}.` : [
        `Weekly report, ${range}`,
        `Visitors: ${fmt(d.thisWeek.visitors)} (${change(d.thisWeek.visitors, d.lastWeek.visitors)})`,
        `Page views: ${fmt(d.thisWeek.pageviews)} (${change(d.thisWeek.pageviews, d.lastWeek.pageviews)})`,
        '', 'Countries:', ...d.countries.map((r) => `  ${countryName(r.country)}: ${fmt(r.visitors)}`),
        '', 'Top pages:', ...d.pages.map((r) => `  ${r.requestPath}: ${fmt(r.visitors)}`),
    ].join('\n');

    return { subject, html, text };
}

/* ---------------------------------------------------------------- send */

async function send({ subject, html, text }) {
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!pass) throw new Error('GMAIL_APP_PASSWORD is not set');
    const { default: nodemailer } = await import('nodemailer');
    const transport = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: TO, pass } });
    await transport.sendMail({ from: `Portfolio analytics <${TO}>`, to: TO, subject, html, text });
}

try {
    if (!DRY_RUN && !TOKEN) throw new Error('VERCEL_TOKEN is not set');
    const data = TOKEN ? await liveData() : sampleData();
    const email = buildEmail(data);
    if (DRY_RUN) {
        await writeFile('weekly-report-preview.html', email.html);
        console.log(`Dry run: wrote weekly-report-preview.html (${data.sample ? 'sample' : 'live'} data). Subject: ${email.subject}`);
    } else {
        await send(email);
        console.log('Weekly report sent.');
    }
} catch (err) {
    console.error(`Weekly report failed: ${err.message}`);
    process.exit(1);
}
