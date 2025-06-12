import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { useLocation } from "react-router-dom";

// Enhanced domains array with icon, desc, and more resources
const domains = [
    {
        name: 'AIML',
        desc: 'Dive into Artificial Intelligence and Machine Learning.',
        icon: '🤖',
        resources: [
            { label: 'Intro to AI', url: 'https://www.coursera.org/learn/ai-for-everyone' },
            { label: 'Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' },
            { label: 'Kaggle Learn- ML', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
        ],
    },
    {
        name: 'Cloud computing',
        desc: 'Master cloud platforms and scalable infrastructure.',
        icon: '☁️',
        resources: [
            { label: 'AWS Training', url: 'https://aws.amazon.com/training/' },
            { label: 'Simplilearn - Full Course', url: 'https://www.youtube.com/watch?v=2LaAJq1lB1Q' },
            { label: 'TechWorld with Nana', url: 'https://www.youtube.com/@TechWorldwithNana' },
        ],
    },
    {
        name: 'Cyber Security',
        desc: 'Protect systems and data with security best practices.',
        icon: '🛡️',
        resources: [
            { label: 'Cybrary', url: 'https://www.cybrary.it/' },
            { label: 'CyberSec Guide', url: 'https://www.w3schools.com/cybersecurity/' },
            { label: 'Cybersecurity Courses & Tutorials', url: 'https://www.codecademy.com/catalog/subject/cybersecurity' },
        ],
    },
    {
        name: 'Data Science',
        desc: 'Analyze and visualize data for insights.',
        icon: '📊',
        resources: [
            { label: 'Intro to DS', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
            { label: 'Kaggle Learn-DS', url: 'https://www.kaggle.com/learn' },
            { label: 'Data Science Tutorial', url: 'https://www.geeksforgeeks.org/data-science-for-beginners/' },
        ],
    },
    {
        name: 'DSA/CP',
        desc: 'Sharpen your skills in algorithms and problem solving.',
        icon: '🧩',
        resources: [
            { label: 'LeetCode', url: 'https://leetcode.com/' },
            { label: 'GeeksforGeeks - DSA Self-Paced', url: 'https://www.geeksforgeeks.org/courses/dsa-self-paced' },
            { label: 'TUF', url: 'https://www.youtube.com/c/takeUforward' },
        ],
    },
    {
        name: 'Full Stack',
        desc: 'Become proficient in both frontend and backend.',
        icon: '🖥️',
        resources: [
            { label: 'Full Stack Open', url: 'https://fullstackopen.com/en/' },
            { label: 'The Odin Project', url: 'https://www.theodinproject.com/' },
            { label: 'Traversy Media - Crash Courses', url: 'https://www.youtube.com/c/TraversyMedia' },
        ],
    },
    {
        name: 'Gen AI, UI/UX Design',
        desc: 'Explore generative AI and creative design workflows.',
        icon: '✨',
        resources: [
            { label: 'Figma Learn + Community Projects', url: 'https://www.figma.com/resource-library/design-basics/' },
            { label: 'Google UX Design', url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
            { label: 'DeepLearning.AI', url: 'https://www.coursera.org/learn/generative-ai-with-llms' },
        ],
    },
    {
        name: 'Web/App Dev',
        desc: 'Build modern websites and mobile apps.',
        icon: '🌐',
        resources: [
            { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
            { label: 'Web Dev Course', url: 'https://www.codecademy.com/catalog/subject/web-development' },
            { label: 'App Dev Course', url: 'https://www.mygreatlearning.com/mobile-app-development/free-courses' },
        ],
    },
    {
        name: 'Information Science',
        desc: 'Manage and analyze information in the digital age.',
        icon: '💾',
        resources: [
            { label: 'Info Science Resources', url: 'https://www.informationisbeautiful.net/' },
            { label: 'Computer Science and Databases', url: 'https://www.khanacademy.org/computing/computer-programming/sql' },
            { label: 'Intro to Information Science', url: 'https://www.coursera.org/courses?query=information%20science' },
        ],
    },
    {
        name: 'Aerospace',
        desc: 'Reach for the skies with aerospace engineering.',
        icon: '🚀',
        resources: [
            { label: 'Intro to Aerospace', url: 'https://ocw.mit.edu/search/?t=Aerospace+Engineering' },
            { label: 'Structures & Materials', url: 'https://www.edx.org/learn/aeronautical-engineering/delft-university-of-technology-introduction-to-aerospace-structures-and-materials' },
            { label: 'NPTEL Course', url: 'https://onlinecourses.nptel.ac.in/noc21_ae11/preview' },
        ],
    },
    {
        name: 'Chemistry',
        desc: 'Explore the world of molecules and reactions.',
        icon: '🧪',
        resources: [
            { label: 'Chemguide ', url: 'https://www.chemguide.co.uk' },
            { label: 'Periodic Videos ', url: ' https://www.youtube.com/user/periodicvideos' },
            { label: 'LibreTexts Chemistry', url: 'https://chem.libretexts.org' },
        ],
    },
    {
        name: 'Civil',
        desc: 'Design and build the infrastructure of tomorrow.',
        icon: '🏗️',
        resources: [
            { label: 'Civil Engineering', url: 'https://www.engineeringcivil.com/' },
            { label: 'Structural Engineering Design', url: 'https://ocw.mit.edu/search/?t=Civil+Engineering' },
            { label: 'The Constructor', url: 'https://theconstructor.org/' },
        ],
    },
    {
        name: 'Electronics',
        desc: 'Explore circuits, microcontrollers, and embedded systems.',
        icon: '🔌',
        resources: [
            { label: 'All About Circuits', url: 'https://www.allaboutcircuits.com/' },
            { label: 'Electronics Tutorials', url: 'https://www.electronics-tutorials.ws/' },
            { label: 'Circuit Bread', url: 'https://www.circuitbread.com/' },
        ],
    },
    {
        name: 'Mathematics',
        desc: 'Master the language of science and technology.',
        icon: '➗',
        resources: [
            { label: 'Khan Academy - Math', url: 'https://www.khanacademy.org/math' },
            { label: '3Blue1Brown', url: 'https://www.3blue1brown.com/' },
            { label: 'Art of Problem Soolving', url: 'https://artofproblemsolving.com/' },
        ],
    },
    {
        name: 'Mechanical',
        desc: 'Understand the mechanics behind machines and structures.',
        icon: '⚙️',
        resources: [
            { label: 'MechE', url: 'https://meche.mit.edu/' },
            { label: 'LearnEngineering', url: 'https://www.lesics.com/' },
            { label: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/search/?d=Mechanical%20Engineering&s=department_course_numbers.sort_coursenum' },
        ],
    },
    {
        name: 'Physics',
        desc: 'Unravel the laws that govern the universe.',
        icon: '🪐',
        resources: [
            { label: 'Khan Academy - Physics', url: 'https://www.khanacademy.org/science/physics' },
            { label: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/' },
            { label: 'MinutePhysics ', url: ' https://www.youtube.com/user/minutephysics' },
        ],
    }
]

function ResPage() {
    const [progress, setProgress] = useState({})
    const [highlightDomain, setHighlightDomain] = useState(null)
    const [highlightResource, setHighlightResource] = useState(null)
    const cardRefs = useRef({})
    const location = useLocation();

    // Animate cards on mount
    useEffect(() => {
        const cards = document.querySelectorAll('.domain-card');
        cards.forEach((card, i) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(40px)';
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }, 200 + i * 80);
        });
    }, []);

    // Highlight/scroll logic
    useEffect(() => {
        // Get highlightDomain from navigation state if available
        const domain = location.state?.highlightDomain || localStorage.getItem('highlightDomain');
        const resource = location.state?.highlightResource || localStorage.getItem('highlightResource');
        setHighlightDomain(domain);
        setHighlightResource(resource);
        if (domain && cardRefs.current[domain]) {
            cardRefs.current[domain].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [location.state]);

    const handleCheck = (domainIdx, resIdx) => {
        setProgress((prev) => ({
            ...prev,
            [`${domainIdx}-${resIdx}`]: !prev[`${domainIdx}-${resIdx}`],
        }))
    }

    return (
        <div className="tech-bg">
            {/* SVG/PNG animated tech background */}
            <div className="bg-svg">
                <svg width="100%" height="100%">
                    <defs>
                        <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#232b5d" />
                            <stop offset="100%" stopColor="#2e6cff" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#bg-gradient)" />
                    <g opacity="0.18">
                        {/* Futuristic grid pattern */}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <line
                                key={i}
                                x1={i * 60}
                                y1="0"
                                x2={i * 60}
                                y2="2000"
                                stroke="#fff"
                                strokeWidth="1"
                            />
                        ))}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={i * 60}
                                x2="2000"
                                y2={i * 60}
                                stroke="#fff"
                                strokeWidth="1"
                            />
                        ))}
                    </g>
                </svg>
            </div>
            <div className="overlay" />
            <main className="main-content">
                <header>
                    <h1>Explore Learning Tracks</h1>
                    <p className="subtitle"><br></br>Discover resources for your chosen domain</p>
                </header>
                <div className="cards-grid">
                    {domains.map((domain, domainIdx) => (
                        <div
                            key={domain.name}
                            className={`domain-card ${highlightDomain === domain.name ? 'highlighted' : ''}`}
                            ref={el => cardRefs.current[domain.name] = el}
                        >
                            <div className="icon">{domain.icon}</div>
                            <h2>{domain.name}</h2>
                            <p className="desc">{domain.desc}</p>
                            <ul>
                                {domain.resources.map((resource, resIdx) => (
                                    <li key={resIdx}>
                                        <input
                                            type="checkbox"
                                            checked={progress[`${domainIdx}-${resIdx}`] || false}
                                            onChange={() => handleCheck(domainIdx, resIdx)}
                                        />
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={highlightResource === resource.label ? 'highlighted' : ''}
                                        >
                                            {resource.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ResPage
