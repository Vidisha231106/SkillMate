import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import QuizPage from "./QuizPage";
import Final from "./Final";
import Flowchart from "./Flowchart";
import ResPage from "./ResPage";

const problems = [
    {
        title: "Smart Food Safety Monitor",
        description: "Build an AI-powered system that can detect food spoilage using image recognition and sensor data. Include a mobile interface for consumers and a dashboard for restaurants.",
        requirements: "Must include: Image processing, data analysis, user interface, and alert system",
        techStack: "Suggested: Python/JavaScript, TensorFlow/OpenCV, React/Flutter, REST API"
    },
    {
        title: "Carbon Footprint Tracker",
        description: "Create a comprehensive application that tracks individual or corporate carbon emissions with real-time suggestions for reduction. Include visualization and gamification elements.",
        requirements: "Must include: Data input system, calculation engine, visualization dashboard, and recommendation engine",
        techStack: "Suggested: React/Vue.js, Node.js, Chart.js/D3.js, Database integration"
    },
    {
        title: "GitHub Portfolio Analyzer",
        description: "Develop a tool that analyzes a developer's GitHub profile and generates insights about their coding patterns, skill progression, and project recommendations.",
        requirements: "Must include: GitHub API integration, data analysis, visualization, and skill assessment",
        techStack: "Suggested: JavaScript/Python, GitHub API, Data visualization library, Web framework"
    },
    {
        title: "Smart City Traffic Optimizer",
        description: "Design a system that optimizes traffic flow in urban areas using real-time data and machine learning predictions. Include emergency vehicle priority routing.",
        requirements: "Must include: Real-time data processing, ML prediction model, routing algorithm, and emergency protocols",
        techStack: "Suggested: Python/Java, ML frameworks, Maps API, Real-time database"
    },
    {
        title: "Accessibility Helper App",
        description: "Build an application that assists people with disabilities in navigating digital platforms and physical spaces using AI and AR/VR technologies.",
        requirements: "Must include: Accessibility features, AI integration, user-friendly interface, and multi-platform support",
        techStack: "Suggested: React Native/Flutter, AI/ML APIs, Accessibility APIs, AR/VR frameworks"
    }
];

const GEMINI_API_KEY = "AIzaSyDEpQJRblQngw-UclzPg98LkyXHu6QGtB0"; // Don't expose in production

function SkillMate() {
    const [page, setPage] = useState("home");
    const [currentProblem, setCurrentProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);
    const [pitch, setPitch] = useState("");
    const [files, setFiles] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    // Reset all states when page is reloaded
    useEffect(() => {
        const resetStates = () => {
            setPage("home");
            setCurrentProblem(problems[Math.floor(Math.random() * problems.length)]);
            setPitch("");
            setFiles([]);
            setFeedback("");
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            // Clear any stored data in localStorage
            localStorage.removeItem("highlightDomain");
            localStorage.removeItem("highlightResource");
        };

        // Add event listener for page load
        window.addEventListener('load', resetStates);

        // Cleanup
        return () => {
            window.removeEventListener('load', resetStates);
        };
    }, []);

    useEffect(() => {
        // Set the page based on the current route
        const path = location.pathname;
        if (path === "/") setPage("home");
        else if (path === "/roadmap") setPage("roadmap");
        else if (path === "/resources") setPage("resources");
        else if (path === "/flowchart") setPage("flowchart");
        else if (path === "/final") setPage("final");
        else if (path === "/hacksim") {
            setPage("hacksim");
            generateProblem();
        }
    }, [location]);

    const navLinks = [
        { label: "Home", target: "home" },
        { label: "Skill Roadmap", target: "roadmap" },
        { label: "Resume Builder", target: "resume" },
        { label: "HackSim", target: "hacksim" }
    ];

    function handleNav(target) {
        setPage(target);
        setFeedback("");
        if (target === "hacksim") {
            generateProblem();
        }
    }

    function handleCard(module) {
        if (module === "roadmap") navigate("/roadmap");
        else if (module === "hacksim") {
            navigate("/hacksim");
        }
    }

    function generateProblem() {
        setCurrentProblem(problems[Math.floor(Math.random() * problems.length)]);
        setFeedback("");
    }

    async function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async function callGeminiAPI(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
            }
        };
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async function submitPitch() {
        setFeedback("");
        if (!currentProblem) {
            setFeedback(<div className="error-message">❌ Please generate a problem statement first.</div>);
            return;
        }
        if (!pitch.trim()) {
            setFeedback(<div className="error-message">❌ Please enter your solution pitch.</div>);
            return;
        }
        if (!files.length) {
            setFeedback(<div className="error-message">❌ Please upload at least one code file.</div>);
            return;
        }
        setLoading(true);
        setFeedback(
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <div className="loading" style={{ width: 40, height: 40 }}></div>
                <p>🤖 AI is analyzing your submission...</p>
            </div>
        );
        try {
            let fileContents = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const content = await readFileAsText(file);
                fileContents.push({
                    name: file.name,
                    content: content.substring(0, 8000),
                    size: file.size
                });
            }
            const evaluationPrompt = `
You are an expert hackathon judge evaluating a submission. Please provide a comprehensive assessment.

**PROBLEM STATEMENT:**
Title: ${currentProblem.title}
Description: ${currentProblem.description}
Requirements: ${currentProblem.requirements}
Suggested Tech Stack: ${currentProblem.techStack}

**PARTICIPANT'S PITCH:**
${pitch}

**SUBMITTED CODE FILES:**
${fileContents.map(file => `
--- ${file.name} (${file.size} bytes) ---
${file.content}
`).join('\n')}

**EVALUATION CRITERIA:**
Please evaluate this submission on a scale of 0-100 and provide detailed feedback on:

1. **Problem Relevance (25%)** - How well does the solution address the problem statement?
2. **Code Quality (25%)** - Is the code well-structured, readable, and following best practices?
3. **Completeness (25%)** - How complete is the implementation compared to the requirements?
4. **Innovation (25%)** - Does the solution show creative thinking and innovative approaches?

**REQUIRED OUTPUT FORMAT:**
Score: [Total Score]/100

**Detailed Breakdown:**
- Problem Relevance: [Score]/25 - [Brief explanation]
- Code Quality: [Score]/25 - [Brief explanation]  
- Completeness: [Score]/25 - [Brief explanation]
- Innovation: [Score]/25 - [Brief explanation]

**Strengths:**
- [List 2-3 key strengths]

**Areas for Improvement:**
- [List 2-3 areas that could be enhanced]

**Overall Feedback:**
[2-3 sentences summarizing the submission]

**Hackathon Readiness:**
[Ready/Needs Work/Good Start] - [Brief justification]
`;
            const evaluation = await callGeminiAPI(evaluationPrompt);
            const scoreMatch = evaluation.match(/Score:\s*(\d+)\/100/);
            const totalScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
            let fileList = Array.from(files).map(file => file.name).join(", ");
            setFeedback(
                <>
                    <div className="score-card">
                        <h3>🏆 AI Evaluation Results</h3>
                        <div className="score-value">{totalScore}/100</div>
                        <small>Overall Score</small>
                    </div>
                    <div style={{ background: "#1e293b", padding: "1rem", borderRadius: 8, margin: "1rem 0" }}>
                        <strong>📂 Files Analyzed:</strong> {fileList}
                    </div>
                    <div style={{ background: "#1e293b", padding: "1rem", borderRadius: 8, margin: "1rem 0" }}>
                        <strong>📝 Your Pitch:</strong> {pitch}
                    </div>
                    <div style={{ background: "#111827", padding: "1.5rem", borderRadius: 8, lineHeight: 1.6 }}>
                        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{evaluation}</pre>
                    </div>
                    <div style={{ textAlign: "center", marginTop: "1rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                        <em>Evaluation powered by Google Gemini AI</em>
                    </div>
                </>
            );
        } catch (error) {
            setFeedback(
                <div className="error-message">
                    <h3>❌ Evaluation Failed</h3>
                    <p><strong>Error:</strong> {error.message}</p>
                    <p><strong>Possible solutions:</strong></p>
                    <ul>
                        <li>Check if your API key is correct</li>
                        <li>Ensure you have internet connection</li>
                        <li>Try reducing the size of uploaded files</li>
                        <li>Make sure your API key has sufficient quota</li>
                    </ul>
                </div>
            );
        } finally {
            setLoading(false);
        }
    }

    const renderContent = () => {
        switch (page) {
            case "home":
                return (
                    <section id="home" className="page active">
                        <div className="welcome">
                            <h1>Learn, Build, and Grow with SkillMate 🚀</h1>
                            <p>Your ultimate ed-tech companion for mastering engineering skills.</p>
                        </div>
                        <div className="cards">
                            <article className="card" onClick={() => handleCard("roadmap")}>
                                <div className="card-icon">🗺️</div>
                                <h3>Skill Roadmap</h3>
                                <p>Interactive guides through essential technical and soft skills.</p>
                                <button>Get Started</button>
                            </article>
                            <article className="card" onClick={() => handleCard("resume")}>
                                <div className="card-icon">📄</div>
                                <h3>Resume Builder</h3>
                                <p>Create professional resumes with live preview and PDF export.</p>
                                <button>Get Started</button>
                            </article>
                            <article className="card" onClick={() => handleCard("hacksim")}>
                                <div className="card-icon">💻</div>
                                <h3>HackSim</h3>
                                <p>Simulate hackathons with problems, timer, pitch, and AI assessment.</p>
                                <button>Get Started</button>
                            </article>
                        </div>
                    </section>
                );
            case "roadmap":
                return <QuizPage />;
            case "resources":
                return <ResPage />;
            case "flowchart":
                return <Flowchart />;
            case "final":
                return <Final />;
            case "hacksim":
                return (
                    <section id="hacksim" className="page active">
                        <section className="module">
                            <h2>HackSim: AI-Powered Hackathon Simulator</h2>
                            <p>Practice hackathons with real-world problems, code evaluation, and AI-powered assessment using Google Gemini.</p>
                            <div id="problem">
                                <h3>🧠 Problem: {currentProblem.title}</h3>
                                <p><strong>Description:</strong> {currentProblem.description}</p>
                                <p><strong>Requirements:</strong> {currentProblem.requirements}</p>
                                <p><strong>Tech Stack:</strong> {currentProblem.techStack}</p>
                                <p><em>⏰ Typical hackathon time: 24-48 hours</em></p>
                                <button onClick={generateProblem}>🔄 Generate New Problem</button>
                            </div>
                            <label htmlFor="pitch">📝 Your Pitch:</label>
                            <textarea
                                id="pitch"
                                rows={5}
                                placeholder="Describe your solution approach, technologies used, and key features..."
                                value={pitch}
                                onChange={e => setPitch(e.target.value)}
                            />
                            <label htmlFor="files">📁 Upload Your Code Files:</label>
                            <input
                                type="file"
                                id="files"
                                multiple
                                accept=".js,.py,.html,.css,.java,.cpp,.c,.php,.rb,.go,.ts,.jsx,.vue,.json,.md"
                                ref={fileInputRef}
                                onChange={e => setFiles(Array.from(e.target.files))}
                            />
                            <small>Supported: .js, .py, .html, .css, .java, .cpp, .c, .php, .rb, .go, .ts, .jsx, .vue, .json, .md</small>
                            <br /><br />
                            <button onClick={submitPitch} disabled={loading}>
                                {loading ? <span className="loading"></span> : "🚀 Submit for AI Evaluation"}
                                {loading && " Evaluating with AI..."}
                            </button>
                            <div id="feedback">{feedback}</div>
                        </section>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <nav className="menu-bar">
                <div className="menu-container">
                    <Link to="/" className="menu-logo">SkillMate</Link>
                    <div className="menu-links">
                        <Link 
                            to="/" 
                            className={`menu-link ${page === "home" ? "active" : ""}`}
                            onClick={() => handleNav("home")}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/roadmap" 
                            className={`menu-link ${page === "roadmap" ? "active" : ""}`}
                            onClick={() => handleNav("roadmap")}
                        >
                            Skill Roadmap
                        </Link>
                        <Link 
                            to="/resume" 
                            className={`menu-link ${page === "resume" ? "active" : ""}`}
                            onClick={() => handleNav("resume")}
                        >
                            Resume Builder
                        </Link>
                        <Link 
                            to="/flowchart" 
                            className={`menu-link ${page === "hacksim" || page === "flowchart" ? "active" : ""}`}
                            onClick={() => handleNav("hacksim")}
                        >
                            HackSim
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="main-content">
                {renderContent()}
            </main>
            <footer>
                <p>© 2025 SkillMate &nbsp;|&nbsp;
                    <a href="https://github.com/shubhangkuber" target="_blank" rel="noopener">GitHub</a> •
                    <a href="https://linkedin.com/in/shubhangkuber" target="_blank" rel="noopener">LinkedIn</a>
                </p>
            </footer>
        </>
    );
}

export default SkillMate;