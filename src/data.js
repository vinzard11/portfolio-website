/**
 * @file data.js
 * @description Contains all the portfolio data for the website.
 * This includes work experience and project information.
 */

// IMPORTANT: Update the URLs for your project documents.
// They should point to the files inside the `public/assets/` folder.

export const workData = [
    {
        company: "Boston College",
        role: "Sr. Data Analyst, Graduate Assistant",
        date: "Nov 2024 – Present",
        summary: "Managed the grant intake lifecycle and pioneered BI dashboards to provide critical KPIs to senior leadership.",
        details: "As a key member of the university's awards intake team, I manage the end-to-end lifecycle for new research grants. I translate complex sponsor requirements into structured data for Oracle PeopleSoft, enabling the timely launch of new research. I took the initiative to bridge a communication gap with senior leadership by developing automated reporting tools in Excel and pioneering a suite of Power BI dashboards from scratch. These tools provide the Vice-Provost with critical, bi-weekly KPIs on financial and operational performance, directly influencing strategic decision-making.",
        visual: { type: 'stat', label: 'Dashboards Built', value: '15+' }
    },
    {
        company: "ZS Associates",
        role: "Business Technology Associate",
        date: "Jan 2022 – Jun 2024",
        summary: "Architected cloud data solutions, led data integrity for major product launches, and automated critical analysis, driving significant revenue and efficiency gains.",
        projects: [
            { 
                title: "Geo-Analytics Tool", 
                details: "This tool was created to immediately recognize the need for a specialty drug based on the geo-location of an internet search for the specific disease that this drug treats or the drug itself. We used masked data from Google and Bing. My role was to help architect and build the back-end processing on AWS (EC2, S3), using Hadoop and Hive. This tool ultimately helped increase RFP win rates for similar projects by 30% and added $500K in annual client revenue.",
                visual: { type: 'stat', label: 'New Revenue', value: '$500K' } 
            },
            { 
                title: "Specialty Pharmacy Data Management", 
                details: "I was responsible for ensuring the accurate tracking of patient-level data for specialty drugs. After identifying flawed logic jeopardizing data representation, I took ownership and fought for a complete revamp of the existing unoptimized code. I built a proof-of-concept with less data to achieve results that were miles faster. Using SQL, I aggregated data on patient info and shipment details, and employed Python and Shell Scripting for automation, including QC tasks and emails. The meticulously organized datasets provided clients with an enhanced understanding of patient needs, drug distribution patterns, and pharmacy inventory levels, leading to a 50% reduction in manual intervention time.",
                visual: { type: 'stat', label: 'Manual Work Cut', value: '50%' } 
            },
            { 
                title: "Data Quality (DQ) Lead", 
                details: "As the lead for the DQ team, I was responsible for new product launches, which involved ensuring all inbound data (dispensary data, inventory, patient statuses) was properly reviewed and ingested. I was responsible for 3 such product launches in 3 months. I future-proofed the ingestion pipeline by initiating the creation of a metadata file which made adding new drugs to the pipeline a mere addition of a filename, significantly reducing data source onboarding time.",
                visual: { type: 'icon', value: 'shield-check' } 
            },
            { 
                title: "KAM Analysis Automation", 
                details: "This analysis for Key Account Managers was usually performed by hand in Excel. The task used to stretch longer than the allocated effort. I did it manually once and then pushed the initiative to automate it. I worked tirelessly to build a Python pipeline that retrieved all necessary details from ~15 tables and generated a color-coded Excel report, disabling the need for training and reducing future effort by over 90%.",
                visual: { type: 'stat', label: 'Effort Reduced', value: '90%+' } 
            }
        ]
    },
    {
        company: "Mother Son Sumi Infotech",
        role: "Machine Learning Intern",
        date: "Jun 2021 – Aug 2021",
        summary: "Led a team to build a novel location recommender system from scratch using TensorFlow, achieving 77.8% accuracy.",
        details: "I was asked to lead a team of sophomores and juniors to create a unique project in the automotive industry using Machine Learning and Analytics. We decided on building a location recommender system based off user's preference from scratch. We eventually ended up with a whole lot of unclean data. It took us almost 1.5 months to clean it up and we parallelly modelled some dummy people data based off the location data to help us suggest a person where they would like to be at that time. The model was built on TensorFlow with multiple NN layers and our first iterations had an accuracy of around 77.8%.",
        visual: { type: 'circle', label: 'Accuracy', value: 78 }
    },
    {
        company: "TikklyAgro Solutions",
        role: "Data Science Intern",
        date: "Sep 2020 – Jan 2021",
        summary: "Built and trained a ResNet-50 model to automate quality grading of produce from images, achieving 97.5% accuracy on real-world data.",
        details: "I had to build a model for their grading system so they could deliver the best fruits and vegetables at the right time. We used a pre-trained ResNet-50 model. Once we got the actual data from the firm and tuned the weights, the model achieved 97.5% accuracy for unseen data along with its ripeness stage.",
        visual: { type: 'circle', label: 'Accuracy', value: 98 }
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
