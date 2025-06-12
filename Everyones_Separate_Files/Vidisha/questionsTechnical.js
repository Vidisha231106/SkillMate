const questions = [
    {
        question: "Have you ever built or trained an AI model?",
        options: [
            { text: "Yes, using Python and libraries like scikit-learn or TensorFlow", subject: "AIML" },
            { text: "I’ve used generative AI tools like ChatGPT or DALL·E", subject: "Gen AI" },
            { text: "No, but I want to learn", subject: null },
            { text: "I’m not sure what this involves", subject: null },
        ],
    },
    {
        question: "Which of these projects have you worked on or want to try?",
        options: [
            { text: "Deploying a website with backend APIs", subject: "Full Stack" },
            { text: "Creating a data dashboard", subject: "Data Science" },
            { text: "Building a login system with encryption", subject: "Cyber Security" },
            { text: "Designing an interface in Figma", subject: "UI/UX Design" },
        ],
    },
    {
        question: "Which domain are you most excited to explore further?",
        options: [
            { text: "Cloud infrastructure and services", subject: "Cloud Computing" },
            { text: "Data Structures & Algorithms", subject: "DSA,CP" },
            { text: "Information management and database systems", subject: "Information Science" },
            { text: "Frontend and backend integration", subject: "Full Stack" },
        ],
    },
    {
        question: "Which tool or concept have you used recently?",
        options: [
            { text: "React.js or Next.js", subject: "Web/App Dev" },
            { text: "Pandas or matplotlib in Python", subject: "Data Science" },
            { text: "AWS or Firebase", subject: "Cloud Computing" },
            { text: "Figma or Adobe XD", subject: "UI/UX Design" },
        ],
    },
    {
        question: "Which skill are you currently trying to improve?",
        options: [
            { text: "Cybersecurity basics", subject: "Cyber Security" },
            { text: "Solving competitive programming problems", subject: "DSA,CP" },
            { text: "Designing better UI experiences", subject: "UI/UX Design" },
            { text: "Building scalable web applications", subject: "Full Stack" },
        ],
    },
    {
        question: "If you had to choose a domain to intern in, which would you pick?",
        options: [
            { text: "AI research and development", subject: "AIML" },
            { text: "Cloud deployment and scaling", subject: "Cloud Computing" },
            { text: "Web application development", subject: "Web/App Dev" },
            { text: "Cybersecurity auditing", subject: "Cyber Security" },
        ],
    },
    {
        question: "What kind of topics genuinely interest you?",
        options: [
            { text: "How intelligent systems learn from data", subject: "AIML" },
            { text: "Creating engaging digital experiences", subject: "UI/UX Design" },
            { text: "How cloud services host large apps", subject: "Cloud Computing" },
            { text: "Finding efficient solutions to logic problems", subject: "DSA,CP" },
        ],
    },
    {
        question: "Which of these tasks would you most enjoy in a project?",
        options: [
            { text: "Designing a full-stack application", subject: "Full Stack" },
            { text: "Creating visual insights from data", subject: "Data Science" },
            { text: "Developing a secure login system", subject: "Cyber Security" },
            { text: "Building a chatbot with NLP", subject: "Gen AI" },
        ],
    },
    {
        question: "Have you worked on or contributed to any of the following project types?",
        options: [
            { text: "Personal portfolio website", subject: "Web/App Dev" },
            { text: "Cloud-hosted application", subject: "Cloud Computing" },
            { text: "Data visualization dashboard", subject: "Data Science" },
            { text: "AI-powered automation tool", subject: "AIML" },
        ],
    },
    {
        question: "Which career area aligns with your future aspirations?",
        options: [
            { text: "Artificial Intelligence and Machine Learning", subject: "AIML" },
            { text: "Cybersecurity and Ethical Hacking", subject: "Cyber Security" },
            { text: "Full-Stack Web Development", subject: "Full Stack" },
            { text: "Cloud Engineering and DevOps", subject: "Cloud Computing" },
        ],
    },
];

export default questions;
