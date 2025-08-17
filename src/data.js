/**
 * @file data.js
 * @description Contains all the portfolio data for the website.
 * This includes work experience and project information.
 */

export const workData = [
    {
        company: "Boston College",
        role: "Sr. Data Analyst, Graduate Assistant",
        date: "Nov 2024 – Present",
        summary: "Managed the grant intake lifecycle and pioneered BI dashboards to provide critical KPIs to senior leadership.",
        tags: ['Data Analysis', 'BI Dashboards'],
        subpage: {
            background: "Boston College receives hundreds of millions in research grants annually. Our team is the crucial first step, ensuring every dollar is meticulously tracked and managed from the outset, which is vital for the university's research integrity and financial health.",
            projectType: "Data Management & Business Intelligence",
            tools: ["Power BI", "Oracle PeopleSoft", "Advanced Excel"],
            location: "Boston, MA",
            years: "2024-Present",
            motto: "Ever to Excel",
            keyPoints: [
                {
                    title: "Core Responsibility: Grant Lifecycle Management",
                    description: "As a key member of the university's awards intake team, I manage the end-to-end lifecycle for new research grants. I translate complex sponsor requirements into structured data for Oracle PeopleSoft, enabling the timely launch of new research.",
                    skill: "Grant & Data Administration"
                },
                {
                    title: "Initiative: Bridging the Data Gap",
                    description: "I took the initiative to bridge a communication gap with senior leadership by developing automated reporting tools in Excel and pioneering a suite of Power BI dashboards from scratch.",
                    skill: "Business Intelligence & Automation"
                },
                {
                    title: "Impact: Influencing Strategic Decisions",
                    description: "These tools provide the Vice-Provost with critical, bi-weekly KPIs on financial and operational performance, directly influencing strategic decision-making.",
                    skill: "Executive-Level Reporting"
                }
            ]
        }
    },
    {
        company: "ZS Associates",
        role: "Business Technology Associate",
        date: "Jan 2022 – Jun 2024",
        summary: "Architected cloud data solutions, led data integrity for major product launches, and automated critical analysis, driving significant revenue and efficiency gains.",
        tags: ['Cloud Architecture', 'Data Integrity', 'Automation'],
        subpage: {
            background: "ZS is a global professional services firm that helps companies develop and deliver products that drive customer value and company results. Our team was one of the core teams for one of ZS's biggest clients, helping their sales and business development pipelines through technology and automation.",
            projectType: "Cloud Data Solutions & Automation for Business Development",
            tools: ["AWS/GCP", "Hadoop", "Hive", "SQL", "SAS", "Python", "Shell Scripting", "Project/Product Management", "Sales/Business Development", "Tableau/Power BI/Looker", "Market Research & Analysis", "GTM"],
            location: "India",
            years: "2022-2024",
            motto: "Impact where it matters",
            keyPoints: [
                {
                    title: "Specialty Pharmacy Data Optimization",
                    challenge: "I identified that flawed logic and highly unoptimized code in our core pipeline were jeopardizing data integrity and consuming excessive cluster resources, leading to slow performance and potential inaccuracies.",
                    solution: "I took full ownership of the problem and championed a complete architectural revamp. To gain buy-in, I developed a Proof of Concept (POC) on a subset of data that proved it could achieve results that were miles faster and more efficient.",
                    impact: "My initiative reduced manual intervention time by 50%, created a 'one-click' data handoff for the operations team, and delivered cleaner, more reliable data that directly influenced the client's vendor payment decisions.",
                    skills: "SQL, Python, Shell Scripting, Advanced Excel/Powerpoint, Data Pipeline Optimization, Process Automation, QC Automation."
                },
                {
                    title: "Geo-Alerts Sales Lead Tool",
                    challenge: "The project was created to develop a first-of-its-kind tool that converted raw, geo-located internet search data into real-time, qualified sales leads for a specialty drug.",
                    solution: "As a key member of the development team, I helped architect and build the entire back-end processing pipeline on AWS, which was responsible for transforming masked third-party data into actionable business intelligence.",
                    impact: "This innovative tool was a massive success, generating $500K in new annual client revenue and directly contributing to a 30% increase in RFP win rates for similar projects.",
                    skills: "AWS (Backend Processing), Geo-analytics, Data Architecture, Third-Party Data Integration, Sales Intelligence."
                },
                {
                    title: "Key Account Manager (KAM) Analytics Automation",
                    challenge: "A critical CRM analysis for the client's most important healthcare accounts was being performed manually in Excel. This process was not only slow and inefficient but also prone to human error.",
                    solution: "After performing the task manually just once, I recognized the opportunity for automation. I dedicated my own time—working nights and weekends—to single-handedly build an automated pipeline in just two weeks.",
                    impact: "The new process completely eliminated the need for manual analysis, removed the dependency on training personnel for the task, and delivered instant, color-coded insights on key client relationships with a single click.",
                    skills: "Process Automation, Pipeline Development, Microsoft Excel (Advanced Reporting), CRM Data Analysis, Rapid Prototyping."
                },
                {
                    title: "Data Quality (DQ) Team Leadership",
                    challenge: "As the DQ Lead, I successfully guided my team through 3 major new drug data launches in under 3 months. To improve our scalability, I initiated and implemented a metadata-driven file system that turned the complex process of adding new products into a simple configuration change.",
                    solution: "I formally addressed a painful, inefficient quarterly delivery process that consistently caused team burnout. I developed a comprehensive 6-month strategic plan to re-architect the core pipeline, presenting it to leadership with a full risk analysis and a proposal for a non-disruptive POC to prove its value in saving both time and money.",
                    impact: "", 
                    skills: "Team Leadership, Strategic Planning, Risk Assessment & Mitigation, SQL, Data Quality Management, Process Scalability, Stakeholder Management."
                }
            ]
        }
    },
    {
        company: "Mother Son Sumi Infotech",
        role: "Machine Learning Intern",
        date: "Jun 2021 – Aug 2021",
        summary: "Led a team to build a novel location recommender system from scratch using TensorFlow, achieving 77.8% accuracy.",
        tags: ['ML', 'TensorFlow'],
        subpage: {
            background: "I was asked to lead a team of sophomores and juniors to create a unique project in the automotive industry using Machine Learning and Analytics. We decided on building a location recommender system based off user's preference from scratch. We eventually ended up with a whole lot of unclean data. It took us almost 1.5 months to clean it up and we parallelly modelled some dummy people data based off the location data to help us suggest a person where they would like to be at that time. The model was built on TensorFlow with multiple NN layers and our first iterations had an accuracy of around 77.8%.",
            projectType: "AI/ML",
            tools: ["TensorFlow", "Python", "Data Science"],
            location: "Remote",
            years: "2021"
        }
    },
    {
        company: "TikklyAgro Solutions",
        role: "Data Science Intern",
        date: "Sep 2020 – Jan 2021",
        summary: "Built and trained a ResNet-50 model to automate quality grading of produce from images, achieving 97.5% accuracy on real-world data.",
        tags: ['Data Science', 'ML'],
        subpage: {
            background: "I had to build a model for their grading system so they could deliver the best fruits and vegetables at the right time. We used a pre-trained ResNet-50 model. Once we got the actual data from the firm and tuned the weights, the model achieved 97.5% accuracy for unseen data along with its ripeness stage.",
            projectType: "AI/ML",
            tools: ["Python", "Computer Vision", "Data Science"],
            location: "Remote",
            years: "2020-2021"
        }
    }
];

export const projectData = [
    { 
        title: "Eagle Career Network - PM Project", 
        summary: "A full project plan for a new student-alumni career platform, including the charter, scope, WBS, and stakeholder register.", 
        details: "As part of my MBA coursework, we were asked to create a feasible, desirable, and viable project specific to Boston College. We brainstormed and arrived at the idea of making an Eagle Career Network to tackle the growing narrative that a degree doesn’t get you a job anymore. The plan was to create a Slack-based workspace initially for a set of 3 different batches of students including some alumni for better networking, job postings, mentoring, and application tracking. We prepared a complete project plan including the Project Charter, Scope Statement, Work Breakdown Structure, Schedule, Budget, and Risk & Stakeholder Registers.",
        documents: [
            { name: "Main Presentation", url: './public/assets/PM_Presentation.pdf' },
            { name: "Project Charter", url: './public/assets/Project_Charter.docx' },
            { name: "Scope Statement", url: './public/assets/Scope_Statement.docx' },
            { name: "Work Breakdown Structure", url: './public/assets/Work_Breakdown_Structure_(WBS).docx' }
        ]
    },
    { 
        title: "CMO Connect - GTM Strategy", 
        summary: "A go-to-market and tiered-membership product strategy designed to monetize a 200+ member waitlist for an exclusive CMO network.",
        details: "For our digital marketing class, we consulted for a real business called CMO Connect. The company, an exclusive referral-based network for CMOs, had a waitlist of over 200 members. They needed a strategy to either expand or onboard the backlog without degrading the brand's exclusivity. We conducted market research, competitor analysis, and developed a tiered-membership product strategy to monetize the waitlist, complete with a go-to-market plan.",
        documents: [{ name: "View Presentation", url: './public/assets/CMO_Connect.pdf' }]
    },
    { 
        title: "P&G Brand Management", 
        summary: "A complete GTM strategy for a new P&G liquid detergent, including brand identity, SOV planning, and a promotional calendar.",
        details: "This project involved working on a P&G case study to launch a new Light Duty Liquid Detergent in a crowded market. The product's key differentiator was a new functional benefit requiring less scrubbing. Our goal was a GTM strategy aimed at a strong launch to instantly build high recognition and recall. We developed the brand's core identity, value proposition, personality, and an extensive SOV and promotion plan to stimulate high growth and a quick breakeven.",
        documents: [{ name: "View P&G Deck", url: './public/assets/P&G_Presentation.pdf' }]
    },
    { 
        title: "McDonald's Strategic Analysis", 
        summary: "An internal and external analysis of McDonald's, including Porter's Five Forces and recommendations based on its cost-leadership strategy.",
        details: "We were tasked with analyzing a company both internally and externally. We picked McDonald's due to its worldwide presence. We performed a Porter's Five Forces analysis, a value chain analysis of their primary and secondary activities, and ultimately categorized their strategy as cost-leadership. Based on this comprehensive analysis, we provided recommendations for their future strategy.",
        documents: [{ name: "View Analysis Deck", url: './public/assets/McDonalds_Presentation.pdf' }]
    },
    { 
        title: "Dispersion Characteristics Simulation", 
        summary: "My undergraduate major project, which developed a new predictive model for core components in radar and high-data-rate communication systems.",
        details: "This was a strategic research project in collaboration with a university professor to explore novel approaches for enhancing core components used in radar and high-data-rate communication systems. I developed and validated a new predictive model using advanced simulations (CST Studio Suite) and experiments, creating a methodology that could significantly reduce future R&D costs and timelines. The work uncovered the scientific principles that prove the feasibility of miniaturizing Traveling Wave Tubes, revealing a potential pathway for a new class of smaller, more efficient commercial products.",
        documents: [{ name: "View Research Presentation", url: './public/assets/Dispersion_Characteristics_Presentation.pdf' }]
    },
    { 
        title: "HCL Gaming Ideathon", 
        summary: "Co-led a team to a top-3 finish by designing a full-stack application with an ML-powered matchmaking system to improve player retention.",
        details: "In this competitive ideathon, I co-led a team of four to design and deploy a full-stack application that directly addressed critical player retention challenges for online gaming platforms. We engineered a machine learning-powered matchmaking system that improved player experience, directly leading to increased user retention. We leveraged a diverse tech stack (Python, SQL, Tableau) to build a robust backend, analyze user data, and create a compelling data visualization dashboard to track key performance indicators. Our solution achieved a top 3 ranking in a competitive field of 50 teams.",
        documents: []
    }
];
