/**
 * @file data.js
 * @description Contains all the portfolio data for the website.
 * This includes work experience and project information.
 */

export const workData = [
    {
        company: "IEA TIMSS & PIRLS",
        slug: "iea-ai-evaluation-measurement",
        role: "Technical Dev/Consultant, AI Evaluation & Measurement",
        date: "May 2026 - Present",
        location: "Chestnut Hill, MA",
        summary: "Own the research program applying LLM comparative judgment and psychometric calibration to item-difficulty estimation.",
        tags: ['LLM Evaluation', 'Psychometrics', 'Front-End', 'Policy'],
        highlights: [
            "Own the research program applying LLM comparative judgment and psychometric calibration to item-difficulty estimation, including explicit treatment of judge reliability, extrapolation limits, and where estimates should not be trusted. Two paper submissions so far.",
            "Translate cross-national assessment results into structured, actionable insights for education ministries and policymakers across participating countries, many of them low- and middle-income.",
            "Build interactive data visualizations that let global stakeholders explore and interrogate complex educational datasets directly.",
            "Migrated internal AI tooling to open-source models hosted on-premise to comply with EU GDPR data-residency requirements."
        ],
        subpage: {
            projectType: "AI Evaluation & Measurement",
            tools: [
                "Python", "SQL", "JavaScript", "React", "DataTables", "HTML/CSS",
                "LLM-as-judge evaluation", "Comparative judgment", "Bradley-Terry models",
                "Psychometric calibration", "Item-difficulty estimation (IRT)",
                "Judge reliability & order invariance", "Evaluation harness design",
                "Interactive dashboards", "Statistical reporting",
                "Open-weight LLMs", "On-premise deployment", "GDPR data residency"
            ],
            location: "Chestnut Hill, MA",
            years: "2026-Present",
            sections: [
                {
                    title: "The Role",
                    content: "I moved into this role in May 2026, after about eight months as an AI engineer on the same team. The job title changed, but the underlying question did not: when a model tells you something about an assessment item, how much of that should you believe?"
                },
                {
                    title: "Research Program",
                    content: "I own the research program applying LLM comparative judgment and psychometric calibration to item-difficulty estimation.\n\nThe interesting part is not getting a model to rank items, which is easy. It is characterizing when the ranking means something. That means explicit treatment of judge reliability, of extrapolation limits, and of the cases where an estimate looks confident and should not be trusted.\n\n**Two paper submissions** have come out of this so far: one auditing order-invariance and transitivity in an LLM judge against a withheld external criterion, the other on how comparison-network design trades off rank recovery against calibrated measurement."
                },
                {
                    title: "Getting Results Used",
                    content: "The other half of the job is making findings usable. I translate cross-national assessment results into structured, actionable insights for education ministries and policymakers across participating countries, many of them low- and middle-income, where the budget implications of a finding are immediate and real.\n\nI build interactive visualizations so those stakeholders can interrogate the data themselves rather than taking my summary on trust. That matters more than it sounds: a ministry that can poke at the numbers is a ministry that can argue with them."
                },
                {
                    title: "Data Residency",
                    content: "I migrated our internal AI tooling to open-source models hosted on-premise, because **EU GDPR data-residency requirements** mean some of this data simply cannot leave its jurisdiction. The cost savings were welcome, but they were not the reason."
                }
            ]
        }
    },
    {
        company: "IEA TIMSS & PIRLS",
        slug: "iea-ai-engineer",
        role: "AI Engineer",
        date: "Sep 2025 - May 2026",
        location: "Chestnut Hill, MA",
        summary: "Built the evaluation and serving infrastructure, and led the migration from proprietary APIs to self-hosted open-source models.",
        tags: ['LLM Infrastructure', 'Evaluation', 'Fine-Tuning', 'On-Prem'],
        highlights: [
            "Designed and implemented a scoring framework evaluating 10,000+ open-ended model outputs against ground truth, fine-tuning open-source weights to improve reasoning consistency at scale.",
            "Built a human-in-the-loop verification layer to catch data-quality and sourcing errors across a multi-model ingestion pipeline (OpenAI, Gemini) before they propagated into fine-tuning data.",
            "Designed a model cascade routing across quantized open-weight models with API fallback under fixed hardware constraints, trading capability against cost and reliability per request type.",
            "Led the migration from proprietary OpenAI APIs to self-hosted open-source LLMs, cutting per-question costs from roughly $60 to near-zero operational compute."
        ],
        subpage: {
            projectType: "LLM Infrastructure & Evaluation",
            tools: [
                "Python", "Open-weight LLMs", "Quantization", "QLoRA / fine-tuning",
                "Model cascades & routing", "LLM-as-judge evaluation",
                "Ground-truth scoring frameworks", "Human-in-the-loop verification",
                "Multi-model ingestion pipelines", "OpenAI API", "Gemini",
                "On-premise deployment", "Cost/latency tradeoff analysis"
            ],
            location: "Chestnut Hill, MA",
            years: "2025-2026",
            sections: [
                {
                    title: "The Role",
                    content: "This was the build-it phase. I joined in September 2025 to get AI systems into the assessment workflow in a way that could actually be defended, which meant most of my time went on evaluation and on infrastructure rather than on prompting."
                },
                {
                    title: "Measurement First",
                    content: "The first piece was measurement. I designed and implemented a scoring framework that evaluates **over 10,000 open-ended model outputs** against ground truth, and fine-tuned open-source weights to improve reasoning consistency at scale.\n\nWithout that harness, every claim about whether a change helped would have been a matter of opinion."
                },
                {
                    title: "Data Quality",
                    content: "Our ingestion pipeline drew on several models, OpenAI and Gemini among them, and errors in sourcing or extraction have a nasty property: if they reach your fine-tuning set, you train on them and they stop looking like errors.\n\nI built a **human-in-the-loop verification layer** to catch data-quality and sourcing problems before they propagated."
                },
                {
                    title: "Cost Under Constraint",
                    content: "I designed a model cascade that routes across quantized open-weight models with API fallback under fixed hardware, trading capability against cost and reliability per request type, so easy requests do not pay frontier prices and hard ones do not silently get a weaker answer.\n\nThat fed into leading the migration from proprietary OpenAI APIs to self-hosted open-source models, which took per-question costs from **around $60 to near-zero operational compute**. The cost argument is the one that gets attention, but the data-residency argument is the one that made it necessary."
                }
            ]
        }
    },
    {
        company: "Boston College",
        slug: "boston-college",
        role: "Sr. Data Analyst, Awards/Grants Intake Team",
        date: "Nov 2024 - Sep 2025",
        location: "Chestnut Hill, MA",
        summary: "Managed the grant intake lifecycle and pioneered BI dashboards to provide critical KPIs to senior leadership.",
        tags: ['Data Analysis', 'BI Dashboards'],
        highlights: [
            "Owned the data lifecycle for university research grants, serving as primary data advisor to the Vice-Provost.",
            "Built automated reporting workflows and a dashboard suite that cut reporting time by 75%.",
            "Translated complex sponsor requirements into usable data for processing, directly enabling the timely launch of new research initiatives."
        ],
        subpage: {
            media: { video: "/videos/BC_Vid.mp4", logo: "/images/bc-logo.png", alt: "Boston College logo" },
            projectType: "Data Management & Business Intelligence",
            tools: ["Power BI", "Oracle PeopleSoft", "Advanced Excel"],
            location: "Boston, MA",
            years: "2024-2025",
            sections: [
                {
                    title: "Context & Overview",
                    content: "As a key member of Boston College's awards intake team, I was positioned at the critical juncture where new research funding opportunities are translated into actionable projects within the university's ecosystem. The process involved managing the end-to-end lifecycle for new research grants, a multi-stage journey from proposal to project execution. This function is vital to the university's research ambitions, ensuring that every new grant is meticulously administered, compliant with sponsor requirements, and seamlessly integrated into our financial and operational frameworks. The primary tool for this process is Oracle PeopleSoft, a robust enterprise resource planning system that serves as the central nervous system for managing grant data."
                },
                {
                    title: "Goals & Challenges",
                    content: "My primary goal was to ensure the timely and accurate launch of new research projects. However, a significant challenge emerged: a communication gap between the granular, day-to-day grant administration and the high-level strategic oversight required by senior leadership, including the Vice-Provost. The existing reporting mechanisms were manual, time-consuming, and lacked the dynamic, real-time insights necessary for agile decision-making. This gap meant that leadership did not have a clear, consistent view of key performance indicators (KPIs) related to our research funding pipeline and operational efficiency. My challenge was to bridge this divide and empower leadership with actionable data."
                },
                {
                    title: "My Role & Contributions",
                    content: "To address these challenges, I expanded my role beyond the standard grant administration. My contributions can be highlighted in three key areas:\n\n**Core Responsibility: Grant Lifecycle Management:** I managed the entire lifecycle of new research grants. This involved interpreting complex sponsor requirements and structuring that information for input into Oracle PeopleSoft. This foundational work was critical for the successful initiation of all new research endeavors. This required a deep understanding of grant and data administration to ensure compliance and accuracy from the outset.\n\n**Initiative: Bridging the Data Gap:** Recognizing the limitations of our existing reporting, I took the initiative to develop a suite of automated reporting tools. This began with leveraging advanced Excel functionalities to streamline immediate data analysis needs. I then pioneered the development of a comprehensive suite of Power BI dashboards from the ground up, a significant step forward in our data visualization and business intelligence capabilities.\n\n**Impact: Influencing Strategic Decisions:** The culmination of my initiative was the delivery of critical, bi-weekly KPIs to the Vice-Provost. These dashboards provided a clear and concise overview of financial and operational performance, transforming raw data into strategic insights. This directly influenced high-level decision-making and provided a consistent, reliable source of information for leadership."
                },
                {
                    title: "Processes & Methods",
                    content: "My approach was methodical and focused on creating sustainable solutions:\n\n**Requirement Gathering:** I started by collaborating with senior leadership to understand their specific data needs and identify the most critical KPIs for monitoring research administration performance.\n\n**Data Extraction and Automation:** I developed automated workflows to extract and clean data from Oracle PeopleSoft, significantly reducing the time and effort required for data preparation.\n\n**Dashboard Development:** Using Power BI, I designed and built a series of interactive dashboards. These visualizations were crafted to be intuitive and user-friendly, allowing for easy exploration of the data and the identification of trends and anomalies. The dashboards included metrics on grant proposal success rates, funding amounts by department, and the efficiency of the grant setup process."
                },
                {
                    title: "Quantifiable Results and Impact",
                    content: "The implementation of these new tools and processes had a measurable impact on the university's research operations:\n\n**Reduced Reporting Time:** The automation of data extraction and reporting reduced the time spent on generating bi-weekly reports by an estimated 75%.\n\n**Enhanced Data Accessibility:** Senior leadership gained on-demand access to key research administration data, enabling more informed and timely decision-making.\n\n**Improved Operational Visibility:** The Power BI dashboards provided unprecedented visibility into the grant lifecycle, allowing for the identification of bottlenecks and areas for process improvement."
                },
                {
                    title: "Lessons Learned and Takeaways",
                    content: "This experience underscored the critical importance of bridging the gap between high-level strategic leadership and on-the-ground data administration. I learned that technical skills create the most value when they illuminate and solve tangible business problems. A key insight was understanding the university's financial reliance on grants, which are subject to the volatility of federal funding cycles and changing administrations. I also discovered that the university must cover significant indirect costs that awards do not, creating a constant strain on internal funds. This realization about the financial pressures facing leadership demonstrated the power of taking ownership to drive meaningful change. Moving forward, I am committed to leveraging data-based insights to promote a culture of continuous improvement and strategic alignment."
                }
            ]
        }
    },
    {
        company: "ZS Associates",
        slug: "zs-associates",
        role: "Associate, Business Technology",
        date: "Jan 2022 - Jun 2024",
        location: "NCR, India",
        summary: "Architected cloud data solutions, led data integrity for major product launches, and automated critical analysis, driving significant revenue and efficiency gains.",
        tags: ['Cloud Architecture', 'Data Integrity', 'Automation'],
        highlights: [
            "Architected a real-time geo-analytics tool for territory planning and resource allocation, processing large-scale demographic and market data to find high-potential regions and market capture opportunities. Drove $500K in new annual revenue.",
            "Diagnosed the root cause of a flawed, unoptimized pipeline producing unreliable client-facing data, then built a proof-of-concept for a re-engineered approach (SQL, Python, Shell) that cut manual QC intervention by 50% and restored data integrity.",
            "Managed commercial data strategy for 3 major product launches, coordinating Sales, Marketing and IT to ensure go-to-market readiness for assets representing 80% of client revenue."
        ],
        subpage: {
            media: { video: "/videos/ZS_Vid.mp4", logo: "/images/zs-logo.png", alt: "ZS Associates logo" },
            projectType: "Cloud Data Solutions & Automation",
            tools: ["AWS", "GCP", "SQL", "Python", "Tableau", "Power BI"],
            location: "India",
            years: "2022-2024",
            sections: [
                {
                    title: "Context & Overview",
                    content: "As an analyst and leader at ZS, I consistently identified and addressed critical inefficiencies within data pipelines and operational processes. My work focused on transforming manual, error-prone tasks into automated, reliable systems that not only improved data integrity but also delivered significant business value, from optimizing resource-intensive pipelines to pioneering new revenue-generating tools."
                },
                {
                    title: "Project 1: Pharmacy Data Optimization",
                    content: "**Goals & Challenges:** The primary goal was to rectify a core data pipeline plagued by flawed logic and highly unoptimized code. This inefficiency was jeopardizing data integrity, consuming excessive cluster resources, and causing slow performance, which threatened to produce inaccurate client-facing data.\n\n**My Role & Contributions:** I took full ownership of the problem, diagnosing the root causes and championing a complete architectural revamp. My primary contribution was designing and developing a Proof of Concept (POC) to demonstrate the viability of a new, streamlined approach.\n\n**Processes & Methods:** To gain stakeholder buy-in, I built the POC on a representative subset of data. Using a combination of SQL, Python, and Shell Scripting, I re-engineered the data flow, focusing on Data Pipeline Optimization and QC Automation. This new model proved to be significantly faster and more efficient.\n\n**Quantifiable Results & Impact:** My initiative reduced manual intervention time by 50% and created a \"one-click\" data handoff for the operations team. The resulting data was cleaner and more reliable, which directly and positively influenced the client's vendor payment decisions."
                },
                {
                    title: "Project 2: Geo-Alerts Sales Tool",
                    content: "**Goals & Challenges:** The project's objective was to develop a first-of-its-kind tool that converted raw, geo-located internet search data into real-time, qualified sales leads for a specialty drug. The main challenge was integrating and transforming masked third-party data into actionable business intelligence securely and efficiently.\n\n**My Role & Contributions:** As a key member of the development team, I was instrumental in architecting and building the entire back-end processing pipeline. I focused on ensuring the system could handle complex geo-analytics and third-party data integration at scale.\n\n**Processes & Methods:** Leveraging AWS for back-end processing, I designed a robust data architecture capable of ingesting, cleaning, and analyzing disparate data sources. The pipeline was built to translate raw signals into concrete sales intelligence for the end-users.\n\n**Quantifiable Results & Impact:** This innovative tool was a massive commercial success, generating $500K in new annual client revenue. Furthermore, its success directly contributed to a 30% increase in RFP win rates for similar projects, showcasing a new and valuable capability for the firm."
                },
                {
                    title: "Project 3: KAM Analytics Automation",
                    content: "**Goals & Challenges:** A critical CRM analysis for the client's most important healthcare accounts was being performed manually in Excel. This process was not only slow and inefficient but also highly susceptible to human error, risking the quality of insights for key strategic decisions.\n\n**My Role & Contributions:** After performing the task manually just once, I recognized the clear opportunity for automation. I took the initiative to build an automated solution, dedicating my own time, working nights and weekends, to avoid risking other project delays.\n\n**Processes & Methods:** Within two weeks, I developed a complete automated pipeline using my expertise in Process Automation and Rapid Prototyping. The solution leveraged Advanced Excel reporting and VBA to process CRM Data Analysis instantly, creating a color-coded dashboard for immediate insights.\n\n**Quantifiable Results & Impact:** The new process eliminated the need for manual analysis, removing a significant operational bottleneck. It also removed the dependency on training personnel for the task and delivered instant, actionable insights on key client relationships with a single click."
                },
                {
                    title: "Project 4: DQ Team Leadership",
                    content: "**Goals & Challenges:** As the DQ Lead, I faced two major challenges: ensuring my team could manage a rapid series of new product launches without compromising quality, and addressing a painful, inefficient quarterly delivery process that was causing team burnout.\n\n**My Role & Contributions:** I successfully guided my team through 3 major new drug data launches in under 3 months. To improve our scalability, I initiated and implemented a metadata-driven file system. Concurrently, I developed a comprehensive 6-month strategic plan to re-architect the core pipeline, which was causing burnout, and presented it to leadership with a full risk analysis.\n\n**Processes & Methods:** The metadata-driven system turned the complex process of adding new products into a simple configuration change, promoting process scalability. For the strategic plan, I leveraged my skills in Risk Assessment & Mitigation and Stakeholder Management to advocate for a non-disruptive POC that would prove the value of the re-architecture in saving time and money.\n\n**Quantifiable Results & Impact:** The new file system significantly improved the team's agility and ability to scale. My strategic advocacy for pipeline improvement demonstrated forward-thinking leadership, addressing team well-being while aligning with long-term business goals for efficiency and cost savings."
                },
                {
                    title: "Takeaway",
                    content: "Across these diverse projects, my core contribution was a relentless drive to move beyond the status quo. I consistently demonstrated an ability to not only identify underlying issues in process and technology but also to proactively design, build, and implement solutions that delivered measurable improvements in efficiency, data quality, and revenue. My work is characterized by a blend of technical expertise, strategic foresight, and a drive to achieve tangible results."
                },
            ]
        }
    }
];

export const projectData = [
    {
        title: "Brand Management: P&G New Product Launch Strategy",
        image: "png.png",
        category: "Business Strategy",
        description: "Full-cycle GTM strategy and STP analysis for a new P&G detergent launch into a competitive CPG market.",
        subpage: {
            documents: [{ name: "View P&G Deck", url: '/assets/P&G_Presentation.pdf' }],
            sections: [
                {
                    title: "Context/Overview",
                    content: "This project simulated a full-cycle product launch, developing the business case and go-to-market strategy for a new P&G detergent. The initiative was designed to capture a new market segment within a highly competitive CPG industry. Our strategy was centered on a unique value proposition, identified through market and user research, which solved a key customer pain point: reducing scrubbing time on tough grease."
                },
                {
                    title: "Product Goals & Business Challenges",
                    content: "The primary product goal was to achieve a dominant market position by securing rapid user adoption and high brand recall. The core business challenge was to develop a market-entry strategy that would quickly capture market share from entrenched competitors and build a defensible brand against subsequent market entries."
                },
                {
                    title: "Product Strategy & Execution",
                    content: "Our strategy was data-based, beginning with a full STP analysis to define our target user persona and product positioning. We developed a comprehensive product launch roadmap, including an integrated marketing plan and a phased promotional strategy. This roadmap began with aggressive user acquisition tactics (sampling, trade allowances) to drive initial trial and transitioned to a sustainable model (coupons, bonus packs) designed to optimize customer lifetime value and accelerate the path to breakeven."
                },
                {
                    title: "Takeaways & Impact",
                    content: "This project demonstrates the ability to translate market insights into a cohesive product and business strategy. It showcases the end-to-end process of identifying a market opportunity, defining a product's value proposition, and executing a GTM plan designed to achieve specific business outcomes like market share and profitability."
                }
            ]
        }
    },
    {
        title: "Strategic Analysis: McDonald's Competitive Framework",
        image: "mcd.jpg",
        category: "Business Strategy",
        description: "Porter's Five Forces and Value Chain teardown of McDonald's competitive moat, with strategic growth recommendations.",
        subpage: {
            documents: [{ name: "View Analysis Deck", url: '/assets/McDonalds_Presentation.pdf' }],
            sections: [
                {
                    title: "Context/Overview",
                    content: "This was a comprehensive analysis of McDonald's global business strategy, framed as a product teardown of a market leader. The project focused on dissecting the company's competitive advantages to identify potential threats and opportunities for growth."
                },
                {
                    title: "Goals & Challenges",
                    content: "The goal was to move beyond a surface-level assessment to produce a data-based analysis of the company's strategic positioning. This required applying rigorous analytical frameworks to evaluate McDonald's moat and provide actionable recommendations that could inform future product or market strategies."
                },
                {
                    title: "Analytical Process & Methods",
                    content: "We conducted a deep competitive landscape analysis using Porter's Five Forces to map the external market pressures. This was paired with an internal Value Chain analysis to identify the core operational and technological capabilities that enable their cost-leadership strategy. This process is analogous to the discovery phase of a product cycle, where the goal is to understand the ecosystem before defining a roadmap."
                },
                {
                    title: "Strategic Insights & Recommendations",
                    content: "The analysis concluded with a set of strategic recommendations aimed at reinforcing McDonald's market leadership. This demonstrates the ability to evaluate a business at a strategic level, identify key drivers of success, and propose data-based initiatives to promote sustainable growth, a core competency in both product management and business development."
                }
            ]
        }
    },
    {
        title: "Product Management: Eagle Career Network Platform",
        image: "pmo.png",
        category: "Business Strategy",
        description: "Led product lifecycle from charter to pilot for a BC career-networking platform, targeting >70% adoption.",
        subpage: {
            documents: [
                { name: "Main Presentation", url: '/assets/PM_Presentation.pdf' },
                { name: "Project Charter", url: '/assets/Project_Charter.docx' },
                { name: "Scope Statement", url: '/assets/Scope_Statement.docx' },
                { name: "Work Breakdown Structure", url: '/assets/Work_Breakdown_Structure.docx' }
            ],
            sections: [
                {
                    title: "Context/Overview",
                    content: "I led the product lifecycle from ideation to pilot for a new digital platform, the \"Eagle Career Network,\" designed to enhance the career services value proposition for Boston College students and alumni. This initiative was a direct response to a clearly identified market need for better professional networking tools."
                },
                {
                    title: "Product Vision & Goals",
                    content: "The product vision was to create a single, engaging ecosystem for career development. Success was defined by three core principles of product discovery: feasibility (technical), desirability (user need), and viability (business sustainability). For the pilot, we set a clear success metric: achieving a >70% user adoption rate to validate the product concept before a full-scale launch."
                },
                {
                    title: "Product Development & Execution",
                    content: "I established the product foundation by creating a project charter, scope statement, and Work Breakdown Structure (WBS). A key part of the process was proactive risk management, where we anticipated potential user adoption challenges. To mitigate this, we incorporated features like gamification and a targeted marketing plan into the product roadmap to drive engagement and promote growth."
                },
                {
                    title: "Takeaways & Impact",
                    content: "This project showcases the end-to-end product management process: identifying a user problem, defining a product vision, building a strategic roadmap, and executing a data-based pilot to validate a hypothesis. It demonstrates a clear ability to manage stakeholders, balance constraints, and focus on delivering user value."
                }
            ]
        }
    },
    {
        title: "Consulting: CMO Connect Growth & Monetization Strategy",
        image: "cmo.jpg",
        category: "Business Strategy",
        description: "Tiered-membership growth strategy and lead-gen roadmap for a B2B networking consulting engagement.",
        subpage: {
            documents: [{ name: "View Presentation", url: '/assets/CMO_Connect.pdf' }],
            sections: [
                {
                    title: "Context/Overview",
                    content: "This was a strategic consulting project for CMO Connect, a real-world B2B networking business. The engagement focused on developing a scalable business model and product strategy to unlock new revenue streams and manage growth effectively."
                },
                {
                    title: "Business Goals & Challenges",
                    content: "The central business problem was how to monetize a large waitlist of potential customers without cannibalizing the brand's core value of exclusivity. The challenge was to transform their existing service into a productized offering that could scale efficiently."
                },
                {
                    title: "Strategy & Recommendations",
                    content: "Through stakeholder interviews and competitor analysis, we identified key opportunities for growth. Our final recommendation was a tiered-membership product strategy, a classic SaaS pricing model designed to capture different customer segments. We also delivered a roadmap for improving their user acquisition funnel by overhauling their website and automating lead generation, directly connecting marketing efforts to sales outcomes."
                },
                {
                    title: "Takeaways & Impact",
                    content: "This project demonstrates strong business acumen and the ability to develop a data-based growth strategy. It involved identifying new market opportunities, creating a monetization plan, and outlining a product roadmap to improve the customer journey, showcasing skills critical for both revenue-focused product management and business development."
                }
            ]
        }
    },
    {
        title: "HCL Gaming Ideathon: ML-Powered Player Retention Platform",
        image: "poker.jpg",
        category: "Technical",
        description: "Built an ML-powered matchmaking MVP to cut player churn, ranked Top 3 of 50 teams.",
        subpage: {
            documents: [],
            sections: [
                {
                    title: "Product Vision & Execution",
                    content: "I co-led a cross-functional team in a rapid development environment to build an MVP addressing a critical business problem in the gaming industry: high player churn. Our solution was a full-stack application featuring a machine learning-powered matchmaking algorithm. This core feature was designed to directly solve a user pain point (poor match quality) and, in turn, drive a key business metric (player retention). We also developed a Tableau dashboard to serve as a product analytics tool for tracking KPIs."
                },
                {
                    title: "Market Validation & Impact",
                    content: "Our product achieved a Top 3 ranking among 50 teams, serving as a strong form of market validation for our solution. This project demonstrates the ability to quickly translate a business need into a functional, data-based product and highlights experience in leading a technical team to deliver a high-impact solution."
                }
            ]
        }
    },
    {
        title: "Advanced Research: Commercialization of Deep Technology",
        image: "helix.png",
        category: "Technical",
        description: "Validated a predictive model for miniaturizing RF components, translating deep research into a commercialization case.",
        subpage: {
            documents: [{ name: "View Research Presentation", url: '/assets/Dispersion_Characteristics_Presentation.pdf' }],
            sections: [
                {
                    title: "Context & Business Application",
                    content: "This strategic research project focused on early-stage technology commercialization. We explored novel approaches to miniaturizing core components for radar and communication systems, with the goal of identifying pathways for a new class of smaller, more efficient commercial products such as circular planar tape helices."
                },
                {
                    title: "From Research to Product Strategy",
                    content: "The core of the project was translating complex scientific findings into an actionable business case. By developing and validating a new predictive model using CST suite, we not only proved the scientific feasibility of miniaturization but also created a methodology that could significantly reduce the R&D costs and timelines for future product development cycles."
                },
                {
                    title: "Takeaways & Strategic Impact",
                    content: "This work showcases the ability to operate at the intersection of deep technology and business strategy. It demonstrates how fundamental research can be leveraged to identify new market opportunities, create a defensible competitive advantage, and lay the groundwork for a future product roadmap."
                }
            ]
        }
    }
];
