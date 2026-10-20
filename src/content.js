/**
 * @file content.js
 * @description Every fact on the site lives here. Pages only arrange it.
 *
 * Rules this file follows, from the owner's brief:
 * - Nothing invented. Numbers come from the résumé, LinkedIn, the papers' public
 *   summaries, or the owner's own notes.
 * - Papers under review are described but never linked.
 * - The post-training work and the multilingual safety project get exactly the
 *   wording the owner approved, nothing more.
 * - No mention of job applications anywhere.
 * - No em or en dashes in copy.
 */

export { projects } from './projects-data.js';

export const site = {
    name: 'Vinith Ayapilla',
    url: 'https://vin-ayapilla-portfolio.vercel.app',
    email: 'vinithhazard@gmail.com',
    location: 'Boston, MA',
    roleLine: 'AI evaluation · measurement · safety',
    collaboration: 'Open to roles and research collaborations',
    resume: '/assets/Vinith_Ayapilla_Resume.pdf',
    social: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinith-ayapilla-521b331a5/' },
        { label: 'GitHub', href: 'https://github.com/vinzard11' },
        { label: 'OpenReview', href: 'https://openreview.net/profile?id=%7ESai_Vinith_Ayapilla1' },
    ],
};

export const thesis = [
    "I'm an engineer who works on measurement. Can we trust what a model says, how would we know, and what does it take to run models responsibly on our own hardware?",
    "Right now that means two jobs at the TIMSS & PIRLS International Study Center, the group behind the big international math, science and reading assessments. I research whether LLM judges can be trusted to estimate how hard a test question is, and I build the systems and the results site that put that data in front of education ministries.",
    "The reason I care is personal. I grew up in India, where who gets good public services and good tools still tracks wealth more than need. I want powerful technology to reach everyone, and to be safe when it does. It's also why I'm part of the <a href=\"/profile#effective-altruism\">effective altruism</a> community.",
];

/** "Currently working on". The first two entries use only the owner's approved wording. */
export const now = [
    {
        title: 'Multilingual LLM safety',
        status: 'In progress',
        text: "I’m working on a project about how AI safety holds up (or doesn’t) once you leave English. Most safety work assumes everyone’s talking to the model in English, and a lot of the world isn’t. More on this soon.",
    },
    {
        title: 'Post-training',
        status: 'In progress',
        text: 'Currently in the process of post-training. More once there are results to share.',
    },
    {
        title: 'TIMSS & PIRLS results site',
        status: 'Shipped October 2026',
        text: 'Rebuilt the report landing page, the accessibility and the phone layouts of the interactive results site.',
        href: '/experience/iea-ai-evaluation-measurement',
    },
];

/**
 * Roles that share a `group` are shown together as one progression.
 */
export const experience = [
    {
        slug: 'iea-ai-evaluation-measurement',
        group: 'timss-pirls',
        company: 'TIMSS & PIRLS International Study Center',
        org: 'IEA · Boston College',
        role: 'Technical Dev/Consultant, AI Evaluation & Measurement',
        date: 'Jun 2026 - Present',
        location: 'Boston, MA · Hybrid',
        summary: 'Rebuilding the interactive results site and running the research on LLM comparative judgment.',
        tags: ['Front-end', 'Accessibility', 'LLM evaluation', 'Psychometrics'],
        highlights: [
            'Rebuilt key parts of the interactive results site for the TIMSS & PIRLS International Study Center (Boston College), shipped through three pull requests in October 2026.',
            'Designed a new report landing page with clean, shareable addresses for all 7 report sections and their 27 sub-pages, plus animated headline graphics that present results without ranking countries.',
            'Brought the main pages in line with WCAG 2.2 AA accessibility. Automated checks went from about 110 errors to zero on the pages audited, and the interactive charts now work fully by keyboard and screen reader.',
            "Made the headline exhibits usable on phones. At phone width the charts had been squeezed to a few pixels wide; they're now full width, with no sideways scrolling.",
            'Replaced 17 hand-copied tab interfaces with one accessible shared component used across 24 exhibit pages.',
            'Own the research program applying LLM comparative judgment and psychometric calibration to item-difficulty estimation. Two papers are under review.',
            'Migrated internal AI tooling to open-source models hosted on-premise to meet EU GDPR data-residency requirements.',
        ],
        sections: [
            {
                title: 'The role',
                body: "I moved into this role in June 2026, after nine months as an AI engineer on the same team. It has two halves. One is the front end of the international results site, the place ministries, researchers and journalists actually read TIMSS and PIRLS results. The other is research on whether a language model can be trusted as a measuring instrument.",
            },
            {
                title: 'Rebuilding the results site',
                body: "I rebuilt key parts of the interactive results site in React and TypeScript, shipped through three pull requests in October 2026.\n\nThe report now has a proper landing page, with clean, shareable addresses for all **7 report sections** and their **27 sub-pages**. The headline graphics are animated, and they present results without ranking countries, which matters when the readers are the countries.\n\nUnder the hood, **17 hand-copied tab interfaces** became one accessible shared component, now used across **24 exhibit pages**.",
            },
            {
                title: 'Accessibility and phones',
                body: "I brought the main pages in line with WCAG 2.2 AA. Automated checks went from **about 110 errors to zero** on the pages audited, and the interactive charts now work fully by keyboard and screen reader.\n\nThe headline exhibits also work on phones now. At phone width the charts had been squeezed to a few pixels wide; they are full width, with no sideways scrolling.",
            },
            {
                title: 'The research program',
                body: "I own the research applying LLM comparative judgment and psychometric calibration to item-difficulty estimation. Getting a model to rank test questions is easy. The interesting part is working out when the ranking means something: judge reliability, extrapolation limits, and the cases where an estimate looks confident and should not be trusted. Two papers have come out of it so far, and both are under review.",
            },
            {
                title: 'Data residency',
                body: "I migrated our internal AI tooling to open-source models hosted on-premise, because **EU GDPR data-residency requirements** mean some of this data cannot leave its jurisdiction.",
            },
        ],
        tools: ['TypeScript', 'React', 'JavaScript', 'HTML/CSS', 'DataTables', 'WCAG 2.2 AA', 'Accessible components', 'Python', 'SQL', 'LLM-as-judge', 'Comparative judgment', 'Bradley-Terry models', 'Psychometric calibration', 'IRT', 'Open-weight LLMs', 'On-premise deployment'],
    },
    {
        slug: 'iea-ai-engineer',
        group: 'timss-pirls',
        company: 'TIMSS & PIRLS International Study Center',
        org: 'IEA · Boston College',
        role: 'AI Engineer',
        date: 'Sep 2025 - Jun 2026',
        location: 'Chestnut Hill, MA · On-site',
        summary: 'Digitized decades of assessment data with LLMs, built the evaluation harness, and moved the stack onto self-hosted open models.',
        tags: ['LLM pipelines', 'Evaluation', 'On-prem'],
        highlights: [
            'Led a project to digitize and structure over two decades of international assessment data, with a pipeline that turns unstructured PDFs and scanned images into usable text using the OpenAI API and open-source models.',
            'Designed and implemented a scoring framework evaluating 10,000+ open-ended model outputs against ground truth, fine-tuning open-source weights to improve reasoning consistency at scale.',
            'Built model-to-model validation and a human-in-the-loop review layer to catch data-quality and sourcing errors across a multi-model ingestion pipeline (OpenAI, Gemini) before they propagated into fine-tuning data.',
            'Designed a model cascade routing across quantized open-weight models with API fallback under fixed hardware constraints, trading capability against cost and reliability per request type.',
            'Led the migration from proprietary OpenAI APIs to self-hosted open-source LLMs, bringing the cost of each additional request to near-zero.',
        ],
        sections: [
            {
                title: 'The role',
                body: "This was the build-it phase. I joined in September 2025 to get AI systems into the assessment workflow in a way that could actually be defended, which meant most of my time went on evaluation and infrastructure rather than on prompting.",
            },
            {
                title: 'Digitizing two decades of assessments',
                body: "I led a project to digitize and structure **over two decades** of international assessment data. Much of it existed only as PDFs and scanned images, so I built a pipeline that turns them into usable, structured text with the OpenAI API and open-source models.",
            },
            {
                title: 'Measurement first',
                body: "I designed and implemented a scoring framework that evaluates **over 10,000 open-ended model outputs** against ground truth, and fine-tuned open-source weights to improve reasoning consistency at scale. Without that harness, every claim about whether a change helped would have been a matter of opinion.",
            },
            {
                title: 'Data quality',
                body: "Errors in sourcing or extraction have a nasty property: if they reach your fine-tuning set, you train on them and they stop looking like errors. I built model-to-model validation and a **human-in-the-loop** review layer, and served as that human, to catch them before they propagated.",
            },
            {
                title: 'Cost under constraint',
                body: "I designed a model cascade that routes across quantized open-weight models with API fallback under fixed hardware, so easy requests do not pay frontier prices and hard ones do not silently get a weaker answer.\n\nThat fed into leading the migration from proprietary OpenAI APIs to self-hosted open-source models, which brought the **marginal cost of each request to near-zero**. The hardware and power are not free, but each additional request costs almost nothing. The cost argument is the one that gets attention, but the data-residency argument is the one that made it necessary.",
            },
        ],
        tools: ['Python', 'OpenAI API', 'Gemini', 'Open-weight LLMs', 'Quantization', 'QLoRA / fine-tuning', 'Model cascades & routing', 'LLM-as-judge', 'Ground-truth scoring', 'Human-in-the-loop review', 'Document digitization', 'On-premise deployment'],
    },
    {
        slug: 'boston-college',
        company: 'Boston College',
        org: 'Office for Sponsored Programs',
        role: 'Senior Data Analyst, Awards & Grants Intake',
        date: 'Nov 2024 - Sep 2025',
        location: 'Chestnut Hill, MA · Hybrid',
        summary: 'Ran the data side of research grant intake and built the reporting that went to the Vice-Provost.',
        tags: ['Data analysis', 'BI dashboards', 'Automation'],
        highlights: [
            'Owned the data lifecycle for university research grants and served as the primary data advisor to the Vice-Provost.',
            'Built automated reporting workflows and a Power BI dashboard suite that cut reporting time by 75%.',
            'Translated complex sponsor requirements into structured data for processing, so new research projects could launch on time.',
            'Built an automated Excel tracker for the KPIs reviewed at bi-weekly executive meetings.',
        ],
        sections: [
            {
                title: 'The role',
                body: "Every new research grant at Boston College passes through intake, where a sponsor's requirements get turned into data the university's systems can act on. I owned that data lifecycle and was the primary data advisor to the Vice-Provost.",
            },
            {
                title: 'Reporting people used',
                body: "Leadership was getting its numbers late and by hand. I built automated reporting workflows and a suite of Power BI dashboards, gathering requirements from the people who would read them, which **cut reporting time by 75%**. An automated Excel tracker fed the KPIs into bi-weekly executive reviews.",
            },
            {
                title: 'Why it mattered',
                body: "Grant intake sounds administrative, and it is. It is also the step that decides whether a funded project starts on time. Getting the data right there was the most direct way to help research actually happen.",
            },
        ],
        tools: ['Power BI', 'Oracle PeopleSoft', 'Advanced Excel', 'SQL', 'Stakeholder interviews'],
    },
    {
        slug: 'zs-associates',
        company: 'ZS Associates',
        org: 'Business Technology',
        role: 'Associate, Business Technology',
        date: 'Jan 2022 - Jun 2024',
        location: 'Gurugram, India · Hybrid',
        summary: 'Two and a half years on healthcare and pharmaceutical commercial data, from pipelines to go-to-market.',
        tags: ['Data engineering', 'Analytics', 'Pharma'],
        highlights: [
            'Built the back-end processing pipeline on AWS for Geo-Alerts, a first-of-its-kind tool that turned geo-located search data into sales leads for a specialty drug. The tool brought in $500K in new annual client revenue.',
            'Diagnosed the root cause of a flawed pipeline producing unreliable client-facing data, then built a proof-of-concept for a re-engineered approach (SQL, Python, Shell) that cut manual QC intervention by 50%.',
            'As data quality lead, oversaw three product launches in three months, integrating dispensary, inventory and patient trial data for assets representing 80% of client revenue.',
            'Automated the Key Account Manager analysis in two weeks, turning a manual review of top strategic accounts into a pipeline.',
        ],
        sections: [
            {
                title: 'The role',
                body: "Two and a half years on healthcare and pharmaceutical commercial data for a specialty-drug client, including patient-side analytics and go-to-market work across three launches. Most of the job was making data work more reliably, then making it useful.",
            },
            {
                title: 'Geo-Alerts',
                body: "Geo-Alerts was a first-of-its-kind tool that turned raw, geo-located internet search data into qualified sales leads for a specialty drug. The hard part was integrating masked third-party data securely and turning it into something a sales team could act on.\n\n**My part:** I was on the development team and built the back-end processing pipeline on AWS, the architecture that ingested, cleaned and analyzed the third-party data at scale and turned raw signals into leads.\n\n**What the tool did:** it brought in **$500K in new annual client revenue**, and its success contributed to a **30% increase in RFP win rates** on similar projects. Those are the tool's results, and the team's, not mine alone.",
            },
            {
                title: 'Fixing a broken pipeline',
                body: "A pipeline tracking patient-level specialty drug data was producing unreliable client-facing numbers. I traced the flawed logic to its root, then built a proof-of-concept for a re-engineered approach in SQL, Python and Shell. It **cut manual QC intervention by 50%** and restored the data's integrity.",
            },
            {
                title: 'Launches and automation',
                body: "As data quality lead I oversaw **three product launches in three months**, integrating dispensary, inventory and patient trial data for assets representing **80% of client revenue**.\n\nSeparately, I automated the Key Account Manager analysis in two weeks, turning a manual review of the client's top strategic accounts into a pipeline.",
            },
        ],
        tools: ['Python', 'SQL', 'Shell', 'AWS', 'GCP', 'Hadoop / Hive', 'Tableau', 'Power BI'],
    },
];

/**
 * Research directory. `figure` is either a chart id from charts.js or an image.
 * Entries without `body` are listed but have no detail page.
 */
export const researchGroups = ['Papers', 'Evaluations', 'Policy', 'In progress'];

export const research = [
    {
        slug: 'auditing-llm-comparative-judges',
        short: 'Auditing LLM comparative judges',
        group: 'Papers',
        title: 'Auditing LLM Comparative Judges Against an External Latent Criterion',
        meta: 'LLM-as-judge / IRT',
        venue: 'NeurIPS 2026',
        status: 'Under review',
        year: '2026',
        authors: 'With Ummugul Bezirhan and Matthias von Davier',
        summary: 'A more internally consistent judge is not a more valid one.',
        figure: { chart: 'audit' },
        held: true,
        body: [
            "LLMs are increasingly used as pairwise judges, and their internal consistency is often treated as evidence that they judge well. We tested that assumption in a setting where the right answer is known independently: item-difficulty parameters estimated from large-scale student response data.",
            "We audited an LLM pairwise judge across **12,804 item pairs**, each presented in both orders, against withheld operational IRT difficulty. Reversing the order changed **11.06%** of judgments. That instability was concentrated among near-ties, and it accounted for **about 95%** of the intransitivity we observed.",
            "Filtering out the unstable judgments produced near-perfect transitivity, but it did not improve criterion validity. A judge can be made more self-consistent without becoming a better measure of the thing you care about.",
        ],
    },
    {
        slug: 'efficient-comparative-judgment-networks',
        short: 'Efficient comparative judgment networks',
        group: 'Papers',
        title: 'Designing Efficient LLM Comparative Judgment Networks for Item Difficulty Estimation',
        meta: 'Bradley-Terry / Network design',
        venue: 'NCME 2027',
        status: 'Under review',
        year: '2027',
        authors: 'With Ummugul Bezirhan and Matthias von Davier',
        summary: 'Efficient ranking designs should not be mistaken for calibrated measurement.',
        figure: { chart: 'network' },
        held: true,
        body: [
            "Preliminary difficulty estimates help test developers spot gaps, revise items and decide what to field-test. Comparative judgment makes this easier by asking only which of two items is harder, and LLMs make it scalable. The question is how to design the comparisons.",
            "We evaluated how anchor information and comparison-network design affect LLM-based item-difficulty estimation, across **1,351 Bradley-Terry fits** over **28 network designs**.",
            "Explicit calibrated anchor information improved scale recovery without improving rank recovery. Sparse networks using **22%** of the full comparison budget kept **98%** of rank correlation, but produced badly overdispersed estimates. A design that ranks items well can still be a poor measuring instrument.",
        ],
    },
    {
        slug: 'uncensored-vs-baseline-benchmarking',
        short: 'Uncensored vs. baseline safety benchmarks',
        group: 'Evaluations',
        title: 'AI Safety Evaluation: Uncensored vs. Baseline Model Benchmarking',
        meta: 'Vending-Bench / AgentHarm / WMDP',
        venue: 'Independent',
        status: 'Aug 2026',
        year: '2026',
        summary: 'Removing the refusal direction made the model worse at the actual task.',
        figure: { chart: 'safety' },
        body: [
            "I ran a local reimplementation of Vending-Bench Mini alongside AgentHarm, StrongREJECT and WMDP, comparing an uncensored (abliterated) open-weight model, Gemma-4 26B, against its stock baseline. Gemini acted as judge, and everything ran under fixed hardware constraints.",
            "The abliterated model did worse at running the business. It went out of business in **every trial**, against **roughly 50%** of trials for the stock model. That was expected given the manual weight surgery on the refusal vector: the edit that removes refusals does not only remove refusals.",
        ],
    },
    {
        slug: 'kosovo-education-policy',
        short: 'Kosovo education policy analysis',
        group: 'Policy',
        title: 'Kosovo Education Policy Analysis: The Enthusiasm and Achievement Paradox',
        meta: 'PIRLS / TIMSS / World Bank',
        venue: 'Independent',
        status: 'Jul 2026',
        year: '2026',
        summary: 'Why some of the most motivated Grade 4 students in the world score so low.',
        figure: { image: '/images/research-kosovo-cover.jpg', alt: 'Cover page of the Kosovo Education Research report' },
        links: [{ label: 'Read the analysis (PDF)', href: '/assets/Kosovo_Education_Analysis.pdf' }],
        body: [
            "A few weeks before writing this, I barely knew Kosovo existed. Then, exploring assessment data, I noticed something strange: Kosovo's Grade 4 students report some of the highest learning motivation in the world, and some of the lowest cognitive-skill conversion.",
            "I cross-referenced IEA PIRLS 2021 and TIMSS 2023 achievement data with World Bank and Kosovo labor-market data to work out why. The analysis runs across socioeconomic conditions, multi-shift schooling bottlenecks, curriculum and brain drain, and ends with a policy roadmap.",
        ],
    },
    {
        slug: 'post-training',
        group: 'In progress',
        title: 'Post-training',
        meta: 'In progress',
        venue: '',
        status: 'Ongoing',
        year: '',
        summary: 'Currently in the process of post-training. More once there are results to share.',
        figure: { chart: 'pending' },
    },
];

export const profile = {
    about: [
        "I trained as an electrical engineer at Shiv Nadar University, spent two and a half years at ZS Associates on healthcare and pharmaceutical data, then did an MBA at Boston College on the STEM track. Since September 2025 I've been at the TIMSS & PIRLS International Study Center, first as an AI engineer and now as a technical consultant on AI evaluation and measurement.",
        "Outside work I read about economics, regulation, policy, ethics and behavioral psychology. I cook a lot, run, boulder, hike and game, and I'm working on becoming a hybrid athlete (still a fair way off). I also follow F1, cricket and Chelsea more closely than is good for me.",
    ],
    ea: {
        lede: "I'm part of the effective altruism community, and it shapes what I work on.",
        body: [
            "EA asks the questions I already cared about: which interventions actually reach people, what they cost per person helped, and how to make powerful technology safe before it is everywhere.",
            "My measurement work comes from the same place. If we cannot tell whether a model is right, we cannot tell whether it is helping anyone.",
        ],
        involvement: [
            { name: 'EA Global: NYC 2026', where: 'New York, NY', what: 'Attendee and volunteer' },
            { name: 'Lens Academy', where: 'Online', what: 'AI Risk Fundamentals and Compute Verification' },
            { name: 'Independent AI safety research', where: 'Boston, MA', what: 'Safety evaluations and research', href: '/research' },
        ],
    },
    volunteering: [
        { name: 'Gifford Cat Shelter', where: 'Brighton, MA', what: 'Volunteer, every weekend' },
        { name: 'Haley House', where: 'Boston, MA', what: 'Soup kitchen volunteer, previously' },
        { name: 'Cradles to Crayons', where: 'Boston, MA', what: 'Volunteer, previously' },
    ],
    education: [
        { school: 'Boston College, Carroll School of Management', degree: 'MBA, STEM track', when: 'May 2026', note: "Dean's Scholar · GMAT 740 · CGPA 3.64", extra: 'Transcript available on request' },
        { school: 'Shiv Nadar University', degree: 'B.Tech, Electrical & Electronics Engineering', when: '2022', note: 'Minor in Big Data Analytics' },
    ],
    skills: [
        { group: 'Evaluation & measurement', items: ['LLM-as-judge', 'Comparative judgment', 'Bradley-Terry models', 'Psychometric calibration & IRT', 'Judge reliability & order invariance', 'Safety benchmarks (AgentHarm, StrongREJECT, WMDP, Vending-Bench)', 'Evaluation harness design', 'Human-in-the-loop review'] },
        { group: 'LLM systems', items: ['RAG', 'Agents & tool use', 'Coding agents', 'On-premise open-model deployment', 'Quantization', 'QLoRA & fine-tuning', 'Model cascades & routing', 'OpenAI API', 'Gemini'] },
        { group: 'Front-end', items: ['TypeScript', 'React', 'JavaScript', 'HTML/CSS', 'DataTables', 'WCAG 2.2 AA accessibility', 'Interactive data visualization'] },
        { group: 'Data & policy', items: ['Python', 'SQL', 'R', 'Statistical reporting', 'Multi-source evidence synthesis', 'Cost-effectiveness modeling', 'Policy analysis', 'LMIC & cross-national data'] },
        { group: 'Business', items: ['Strategy', 'Go-to-market', 'Commercial pharma data', 'Stakeholder management', 'Power BI', 'Tableau'] },
    ],
};
