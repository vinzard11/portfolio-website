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
    roleLine: 'AI enablement · evaluation · engineering',
    collaboration: 'Open to roles and research collaborations',
    resume: '/assets/Vinith_Ayapilla_Resume.pdf',
    social: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinith-ayapilla-521b331a5/' },
        { label: 'GitHub', href: 'https://github.com/vinzard11' },
        { label: 'OpenReview', href: 'https://openreview.net/profile?id=%7ESai_Vinith_Ayapilla1' },
    ],
};

export const thesis = [
    "I build AI tools and get people to actually use them, and I make sure they hold up. That means finding where teams lose time, building the pipelines, running models on hardware you control, measuring whether the output can be trusted, and shipping it to the people who need it.",
    "Right now that's at the TIMSS & PIRLS International Study Center, the group behind the big international math, science and reading assessments. I moved our LLM workloads onto self-hosted open models and built the evaluation that checks the results. Now I build full-stack AI apps for the teams there, including a translation verification tool for TIMSS 2027, and I'm rebuilding the results site that puts the data in front of education ministries. Before that, I spent two and a half years at ZS Associates on healthcare and pharmaceutical data.",
    "The reason I care is personal. I grew up in India, where who gets good public services and good tools still tracks wealth more than need. I want powerful technology to reach everyone, safely, and in a way that actually works for them.",
];

/** "Currently working on". Post-training and multilingual safety use only the owner's approved wording. */
export const now = [
    {
        title: 'Translation verification app',
        status: 'In progress',
        text: 'A full-stack app for the Operations team’s TIMSS 2027 translation verification, replacing manually pasting translations into chatbots and Google Translate. V1 runs on the OpenAI API with React and PostgreSQL; V2 adds local open models on our in-house GPU server.',
        href: '/experience/iea-ai-evaluation-measurement',
    },
    {
        title: 'TIMSS & PIRLS results site',
        status: 'Shipped October 2026',
        text: 'Rebuilt the report landing page, the accessibility and the phone layouts of the interactive results site.',
        href: '/experience/iea-ai-evaluation-measurement',
    },
    {
        title: 'Post-training',
        status: 'Dataset built',
        text: 'Standardized three decades of assessment items into one versioned dataset for post-training a model to predict item parameters, and caught an integrity issue before it reached training data.',
    },
    {
        title: 'Multilingual LLM safety',
        status: 'In progress',
        text: "I’m working on a project about how AI safety holds up (or doesn’t) once you leave English. Most safety work assumes everyone’s talking to the model in English, and a lot of the world isn’t. More on this soon.",
    },
];

/** "What I do" on the home page: each claim points at the work that backs it. */
export const capabilities = [
    {
        title: 'Put models to work',
        text: 'Moved production LLM workloads from proprietary APIs to self-hosted open models, routing across models with an API fallback, to meet EU data-residency rules.',
        href: '/experience/iea-ai-engineer',
        link: 'AI Engineer role',
    },
    {
        title: 'Turn messy data into something usable',
        text: 'Built an ingestion pipeline (LangChain, OpenAI and Gemini) with human-in-the-loop verification to digitize decades of print-only research data into one schema.',
        href: '/experience/iea-ai-engineer',
        link: 'How it was built',
    },
    {
        title: 'Get teams to use it',
        text: 'Building a full-stack translation app that replaces pasting text into chatbots for TIMSS 2027 translation verification, and deployed a meeting-minutes tool now used across teams. Owned adoption through the initial skepticism.',
        href: '/experience/iea-ai-evaluation-measurement',
        link: 'Current role',
    },
    {
        title: 'Measure whether it works',
        text: 'Built an evaluation harness scoring 10,000+ open-ended student responses against ground truth, and research how far LLM judges can be trusted.',
        href: '/research',
        link: 'Research',
    },
    {
        title: 'Ship it to people',
        text: 'Rebuilding the TIMSS & PIRLS international results site in React and TypeScript, to WCAG 2.2 AA: more dynamic, mobile-ready and accessible for the ministries and researchers who read it.',
        href: '/experience/iea-ai-evaluation-measurement',
        link: 'The rebuild',
    },
    {
        title: 'Translate it for decision-makers',
        text: 'Turn findings into recommendations for audiences from technical teams to education ministries, and scope what leadership actually needs before building the dashboard.',
        href: '/profile#skills',
        link: 'Skills',
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
        role: 'Technical Dev/Consultant (AI)',
        date: 'Jun 2026 - Present',
        location: 'Boston, MA · Hybrid',
        summary: 'Building full-stack AI apps for internal teams, running LLM-as-judge evaluations, and rebuilding the international results site.',
        tags: ['Full-stack AI apps', 'AI adoption', 'LLM evaluation', 'Front-end', 'Accessibility'],
        highlights: [
            'Building a full-stack translation and comparison web app for the Operations team’s TIMSS 2027 translation verification, replacing manually pasting translations into chatbots and Google Translate. V1 runs on the OpenAI API with React, and PostgreSQL logs outputs and token and spend metrics; V2 adds local open models on our in-house GPU server.',
            'Design and run LLM-as-judge evaluations of test items. Iterated judge prompts across versions (metadata, few-shot calibration) and ran error analysis showing the gains concentrated on easy comparisons, not near-ties: a more consistent judge is not necessarily a more accurate one.',
            'Deployed internal AI tools, including a meeting-minutes tool now used across teams, and owned adoption through the initial skepticism.',
            'Standardized three decades of assessment items into one versioned dataset for post-training a model to predict item parameters, and caught an integrity issue before it reached training data.',
            'Run parallel workstreams with our PI and directors: two paper submissions, a post-training dataset and the reporting-site rebuild.',
            'Rebuilding the international results site in React and TypeScript for education ministries and researchers; the first parts shipped through three pull requests in October 2026.',
            'Designed a new report landing page with clean, shareable addresses for all 7 report sections and their 27 sub-pages, plus animated headline graphics that present results without ranking countries.',
            'Brought the main pages in line with WCAG 2.2 AA accessibility. Automated checks went from about 110 errors to zero on the pages audited, and the interactive charts now work fully by keyboard and screen reader.',
            "Made the headline exhibits usable on phones. At phone width the charts had been squeezed to a few pixels wide; they're now full width, with no sideways scrolling.",
            'Replaced 17 hand-copied tab interfaces with one accessible shared component used across 24 exhibit pages.',
            'Own the research program applying LLM comparative judgment and psychometric calibration to item-difficulty estimation. Two papers so far: one under review, one being revised for resubmission.',
            'Migrated internal AI tooling to open-source models hosted on-premise to meet EU GDPR data-residency requirements.',
        ],
        sections: [
            {
                title: 'The role',
                body: "I moved into this role in June 2026, after nine months as an AI engineer on the same team. The work has three parts. One is building AI tools that the center's own teams use. Another is the front end of the international results site, the place ministries, researchers and journalists actually read TIMSS and PIRLS results. The third is research on whether a language model can be trusted as a measuring instrument.",
            },
            {
                title: 'A translation verification app',
                body: "The Operations team verifies translations for TIMSS 2027, and that used to mean manually pasting text into chatbots and Google Translate. I'm building a **full-stack translation and comparison web app** to replace it.\n\n**V1** runs on the OpenAI API with a React front end, and PostgreSQL logs every output along with **token and spend metrics**. **V2** adds local open models on our in-house GPU server.",
            },
            {
                title: 'Getting AI into daily work',
                body: "Most of the value of AI inside an organization is decided by whether people use it. Alongside the translation app, I deployed internal AI tools, including a **meeting-minutes tool now used across teams**. It was not welcomed on day one, so I owned adoption through the initial skepticism, which mostly meant fixing what people actually complained about.",
            },
            {
                title: 'Rebuilding the results site',
                body: "I'm rebuilding the interactive results site in React and TypeScript to make it more dynamic, mobile-ready and accessible. The first parts shipped through three pull requests in October 2026.\n\nThe report now has a proper landing page, with clean, shareable addresses for all **7 report sections** and their **27 sub-pages**. The headline graphics are animated, and they present results without ranking countries, which matters when the readers are the countries.\n\nUnder the hood, **17 hand-copied tab interfaces** became one accessible shared component, now used across **24 exhibit pages**.",
            },
            {
                title: 'Accessibility and phones',
                body: "I brought the main pages in line with WCAG 2.2 AA. Automated checks went from **about 110 errors to zero** on the pages audited, and the interactive charts now work fully by keyboard and screen reader.\n\nThe headline exhibits also work on phones now. At phone width the charts had been squeezed to a few pixels wide; they are full width, with no sideways scrolling.",
            },
            {
                title: 'The research program',
                body: "I own the research applying LLM comparative judgment and psychometric calibration to item-difficulty estimation. Getting a model to rank test questions is easy. The interesting part is working out when the ranking means something: judge reliability, extrapolation limits, and the cases where an estimate looks confident and should not be trusted.\n\nI design and run the LLM-as-judge evaluations: iterating judge prompts across versions (metadata, few-shot calibration), then running error analysis on where the gains land. They concentrated on easy comparisons, not near-ties, which is how we found that **a more consistent judge is not necessarily a more accurate one**. Two papers have come out of it so far: one is under review, and the other is being revised for resubmission.",
            },
            {
                title: 'A dataset for post-training',
                body: "I standardized **three decades of assessment items** into one versioned dataset for post-training a model to predict item parameters, and caught an integrity issue before it reached training data.",
            },
            {
                title: 'Data residency',
                body: "I migrated our internal AI tooling to open-source models hosted on-premise, because **EU GDPR data-residency requirements** mean some of this data cannot leave its jurisdiction.",
            },
        ],
        tools: ['Full-stack web apps', 'PostgreSQL', 'OpenAI API', 'Local open models', 'Workflow mapping', 'Adoption & change management', 'TypeScript', 'React', 'JavaScript', 'HTML/CSS', 'DataTables', 'WCAG 2.2 AA', 'Accessible components', 'Python', 'SQL', 'LLM-as-judge', 'Comparative judgment', 'Bradley-Terry models', 'Psychometric calibration', 'IRT', 'Open-weight LLMs', 'On-premise deployment'],
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
            'Digitized decades of print-only assessment items with LLM-assisted transcription, using the OpenAI API and open-source models, and standardized them into one schema across assessment cycles.',
            'Built an evaluation harness scoring 10,000+ open-ended student responses against ground truth, with a human-in-the-loop layer catching data-quality and sourcing errors across a multi-model pipeline (OpenAI, Gemini).',
            'Designed a model cascade routing across quantized open-weight models with API fallback under fixed hardware constraints, trading capability against cost and reliability per request type.',
            'Led the migration from proprietary OpenAI APIs to self-hosted open-source LLMs, bringing the cost of each additional request to near-zero.',
        ],
        sections: [
            {
                title: 'The role',
                body: "This was the build-it phase. I joined in September 2025 to get AI systems into the assessment workflow in a way that could actually be defended, which meant most of my time went on evaluation and infrastructure rather than on prompting.",
            },
            {
                title: 'Digitizing decades of assessments',
                body: "I digitized **decades of print-only assessment items**. Most existed only as PDFs and scanned pages, so I built LLM-assisted transcription with the OpenAI API and open-source models, and standardized every assessment cycle into one schema.",
            },
            {
                title: 'Measurement first',
                body: "I built an evaluation harness that scores **over 10,000 open-ended student responses** against ground truth. Without it, every claim about whether a change helped would have been a matter of opinion.",
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
        tools: ['Python', 'LangChain', 'OpenAI API', 'Gemini', 'Open-weight LLMs', 'Quantization', 'QLoRA / fine-tuning', 'Model cascades & routing', 'LLM-as-judge', 'Ground-truth scoring', 'Human-in-the-loop review', 'Document digitization', 'On-premise deployment'],
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
            'Scoped leadership\'s reporting needs and built Power BI dashboards that delivered bi-weekly research-funding KPIs to the Vice-Provost; automated data extraction from Oracle PeopleSoft, cutting reporting time by 75%.',
            'Managed new-award intake end to end: interpreted sponsor requirements, tracked grant budgets and ensured compliance before projects launched.',
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
        role: 'Associate, Business Technology (Data Quality Lead)',
        date: 'Jan 2022 - Jun 2024',
        location: 'Gurugram, India · Hybrid',
        summary: 'Two and a half years on healthcare and pharmaceutical commercial data, from pipelines to go-to-market.',
        tags: ['Data engineering', 'Analytics', 'Pharma'],
        highlights: [
            'Proposed and co-built Geo-Alerts with a pharma client: a geo-analytics tool that turned de-identified search-demand data into sales leads. It brought in $500K in new annual revenue, and the client adopted it across its other specialty drugs.',
            'Migrated the data science team\'s experimental data from a legacy system to a cloud platform (CDR-SCE) using SAS and Shell.',
            'Diagnosed the root cause of a flawed pipeline producing unreliable client-facing data, then built a proof-of-concept for a re-engineered approach (SQL, Python, Shell) that cut manual QC intervention by 50%. Orchestrated the pipelines in Airflow and Azkaban, with monitoring that paused workflows and alerted the team on severe failures.',
            'As data quality lead, worked directly with client Sales, Marketing and IT teams across three specialty drug launches in under three months, resolving data issues ahead of go-to-market and integrating dispensary, inventory and patient trial data for assets representing 80% of client revenue.',
            'Redesigned the Key Account Manager workflow, turning a manual review of top strategic accounts into an automated pipeline in two weeks and cutting administrative overhead by 90%.',
        ],
        sections: [
            {
                title: 'The role',
                body: "Two and a half years on healthcare and pharmaceutical commercial data for a specialty-drug client, including patient-side analytics and go-to-market work across three launches. Most of the job was making data work more reliably, then making it useful.",
            },
            {
                title: 'Geo-Alerts',
                body: "Geo-Alerts was a first-of-its-kind tool that turned raw, geo-located internet search data into qualified sales leads for a specialty drug. The hard part was integrating masked third-party data securely and turning it into something a sales team could act on.\n\n**My part:** I proposed the tool and co-built it with the client. On the build, I owned the back-end processing pipeline on AWS, the architecture that ingested, cleaned and analyzed the de-identified data at scale and turned raw signals into leads.\n\n**What the tool did:** it brought in **$500K in new annual client revenue**, the client adopted it across its other specialty drugs, and its success contributed to a **30% increase in RFP win rates** on similar projects. Those are the tool's results, and the team's, not mine alone.",
            },
            {
                title: 'Moving to the cloud',
                body: "I migrated the data science team's experimental data off a legacy system and onto a cloud platform, CDR-SCE, using SAS and Shell, so the team could work from one current source instead of a system nobody wanted to touch.",
            },
            {
                title: 'Fixing a broken pipeline',
                body: "A pipeline tracking patient-level specialty drug data was producing unreliable client-facing numbers. I traced the flawed logic to its root, then built a proof-of-concept for a re-engineered approach in SQL, Python and Shell. It **cut manual QC intervention by 50%** and restored the data's integrity. I orchestrated the pipelines in **Airflow and Azkaban**, with monitoring tiered by severity: severe failures paused the workflow and alerted the team, so real problems stood out from noise.",
            },
            {
                title: 'Launches and automation',
                body: "As data quality lead I worked directly with client Sales, Marketing and IT teams across **three specialty drug launches in under three months**, resolving data issues ahead of go-to-market and integrating dispensary, inventory and patient trial data for assets representing **80% of client revenue**.\n\nSeparately, I redesigned the Key Account Manager workflow. A manual review of the client's top strategic accounts became an automated pipeline in two weeks, **cutting administrative overhead by 90%**.",
            },
        ],
        tools: ['Python', 'SQL', 'SAS', 'Shell', 'Airflow', 'Azkaban', 'AWS', 'GCP', 'Hadoop / Hive', 'Tableau', 'Power BI'],
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
        venue: 'Working paper',
        status: 'Revising',
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
        title: 'Post-training a model on TIMSS items',
        short: 'Post-training on TIMSS items',
        meta: 'Dataset / IRT prediction',
        venue: '',
        status: 'Dataset built',
        year: '',
        summary: 'Standardized three decades of assessment items into one versioned dataset for post-training a model to predict item parameters, and caught an integrity issue before it reached training data.',
        figure: { chart: 'pending' },
    },
];

export const profile = {
    about: [
        "I trained as an electrical engineer at Shiv Nadar University, spent two and a half years at ZS Associates on healthcare and pharmaceutical data, then did an MBA at Boston College on the STEM track. Since September 2025 I've been at the TIMSS & PIRLS International Study Center, first as an AI engineer and now as a technical developer and consultant, building AI tools, evaluations and the international results site.",
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
        { group: 'AI delivery & adoption', items: ['Use-case discovery', 'Workflow mapping', 'Requirement gathering', 'Adoption & change management', 'Business cases', 'Executive presentations', 'Prompt & behavior design', 'AI governance (GDPR)'] },
        { group: 'LLM systems', items: ['Full-stack AI apps', 'LangChain', 'REST APIs', 'RAG', 'Agents & tool use', 'Coding agents', 'On-premise open-model deployment', 'Quantization', 'QLoRA & fine-tuning', 'Model cascades & routing', 'OpenAI API', 'Gemini'] },
        { group: 'Front-end', items: ['TypeScript', 'React', 'JavaScript', 'HTML/CSS', 'DataTables', 'WCAG 2.2 AA accessibility', 'Interactive data visualization'] },
        { group: 'Data & policy', items: ['Python', 'SQL', 'PostgreSQL', 'R', 'Statistical reporting', 'Multi-source evidence synthesis', 'Cost-effectiveness modeling', 'Policy analysis', 'LMIC & cross-national data'] },
        { group: 'Business', items: ['Strategy', 'Go-to-market', 'Commercial pharma data', 'Stakeholder management', 'KPI design', 'Power BI', 'Tableau'] },
        { group: 'Languages', items: ['English', 'Hindi', 'Telugu', 'Kannada'] },
    ],
};
