import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

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

    const navLinks = [
        { label: "Home", target: "home" },
        { label: "Skill Roadmap", target: "roadmap" },
        { label: "Resume Builder", target: "resume" },
        { label: "HackSim", target: "hacksim" }
    ];

    function handleNav(target) {
        setPage(target);
        setFeedback("");
        if (target === "hacksim" && !currentProblem) {
            generateProblem();
        }
    }

    function handleCard(module) {
        setPage(module);
        setFeedback("");
        if (module === "hacksim" && !currentProblem) {
            generateProblem();
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

    return (
        <>
            <style>{`
      /* ... Paste your CSS here ... */
      /* === Reset & base === */
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; line-height: 1.5; }
      a { color: #38bdf8; text-decoration: none; transition: color 0.3s ease; }
      a:hover, a:focus { color: #0ea5e9; }
      button { background: #38bdf8; border: none; padding: 0.7rem 1.5rem; color: white; font-weight: 600; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease; }
      button:hover, button:focus { background-color: #0ea5e9; }
      button:disabled { background-color: #64748b; cursor: not-allowed; }
      h1, h2, h3 { margin: 0 0 1rem 0; font-weight: 700; }
      p { margin: 0 0 1rem 0; }
      .container { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem 4rem; }
      header { background-color: #1e293b; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.7); position: sticky; top: 0; z-index: 1000; }
      .logo { font-size: 1.75rem; font-weight: 800; color: #38bdf8; letter-spacing: 2px; }
      nav a { margin-left: 2rem; font-weight: 600; font-size: 1rem; }
      nav a.active { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 0.15rem; }
      .page { display: none; }
      .page.active { display: block; }
      #home .welcome { text-align: center; margin: 3rem 0 4rem; }
      #home .welcome h1 { font-size: 2.8rem; color: #38bdf8; }
      #home .welcome p { font-size: 1.3rem; color: #94a3b8; }
      .cards { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
      .card { background: #1e293b; flex: 1 1 280px; max-width: 320px; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.6); padding: 2rem 1.8rem; text-align: center; transition: transform 0.3s ease; cursor: pointer; }
      .card:hover, .card:focus { transform: translateY(-6px); box-shadow: 0 10px 25px rgba(0,0,0,0.9); }
      .card-icon { font-size: 3.5rem; margin-bottom: 1rem; color: #38bdf8; }
      .card h3 { margin-bottom: 1rem; font-size: 1.6rem; }
      .card p { color: #94a3b8; font-size: 1rem; margin-bottom: 1.5rem; }
      .card button { width: 100%; font-size: 1rem; }
      section.module { background: #1e293b; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.6); padding: 2rem 2.5rem; max-width: 900px; margin: 2rem auto; }
      section.module h2 { color: #38bdf8; margin-bottom: 1rem; text-align: center; }
      section.module p { color: #cbd5e1; font-size: 1.1rem; margin-bottom: 1rem; }
      footer { background-color: #1e293b; text-align: center; padding: 1.5rem 1rem; font-size: 0.9rem; color: #94a3b8; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
      footer a { margin: 0 0.5rem; font-size: 1.2rem; }
      @media (max-width: 768px) {
        .cards { flex-direction: column; align-items: center; }
        nav a { margin-left: 1rem; font-size: 0.9rem; }
      }
      .api-config { background: #111827; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #f59e0b; }
      .api-config h3 { color: #f59e0b; margin-bottom: 1rem; }
      .api-config input { width: 100%; padding: 0.8rem; border: 2px solid #374151; border-radius: 6px; background: #1f2937; color: #f8fafc; font-size: 1rem; margin-bottom: 0.5rem; }
      .api-config input:focus { outline: none; border-color: #f59e0b; }
      .api-config small { color: #9ca3af; font-size: 0.85rem; }
      #hacksim textarea, #hacksim input[type="file"] { width: 100%; margin: 10px 0 20px 0; font-size: 1rem; padding: 0.8rem; border-radius: 6px; border: 2px solid #374151; background: #111827; color: #f8fafc; }
      #hacksim textarea:focus, #hacksim input[type="file"]:focus { outline: none; border-color: #38bdf8; }
      #hacksim label { display: block; font-weight: 600; color: #f8fafc; margin: 1rem 0 0.5rem 0; }
      #hacksim button { margin-top: 10px; margin-right: 10px; }
      #feedback { background: #111827; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #22c55e; margin-top: 20px; white-space: pre-wrap; color: #f8fafc; font-family: 'Courier New', monospace; line-height: 1.6; }
      #problem { background: #1e293b; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #38bdf8; margin: 20px 0; font-weight: bold; color: #f8fafc; }
      .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid #64748b; border-radius: 50%; border-top-color: #38bdf8; animation: spin 1s ease-in-out infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .score-card { background: #1e293b; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #10b981; }
      .score-value { font-size: 2rem; font-weight: bold; color: #10b981; }
      .error-message { background: #7f1d1d; color: #fecaca; padding: 1rem; border-radius: 8px; border-left: 4px solid #dc2626; margin: 1rem 0; }
      `}</style>
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
            <main className="container">
                {/* Home Dashboard */}
                <section id="home" className={`page${page === "home" ? " active" : ""}`} tabIndex={0}>
                    <div className="welcome" role="banner">
                        <h1>Learn, Build, and Grow with SkillMate 🚀</h1>
                        <p>Your ultimate ed-tech companion for mastering engineering skills.</p>
                    </div>
                    <div className="cards" role="list">
                        <article className="card" role="listitem" tabIndex={0} data-module="roadmap" onClick={() => handleCard("roadmap")}>
                            <div className="card-icon" aria-hidden="true">🗺️</div>
                            <h3>Skill Roadmap</h3>
                            <p>Interactive guides through essential technical and soft skills.</p>
                            <button type="button" aria-label="Get started with Skill Roadmap">Get Started</button>
                        </article>
                        <article className="card" role="listitem" tabIndex={0} data-module="resume" onClick={() => handleCard("resume")}>
                            <div className="card-icon" aria-hidden="true">📄</div>
                            <h3>Resume Builder</h3>
                            <p>Create professional resumes with live preview and PDF export.</p>
                            <button type="button" aria-label="Get started with Resume Builder">Get Started</button>
                        </article>
                        <article className="card" role="listitem" tabIndex={0} data-module="hacksim" onClick={() => handleCard("hacksim")}>
                            <div className="card-icon" aria-hidden="true">💻</div>
                            <h3>HackSim</h3>
                            <p>Simulate hackathons with problems, timer, pitch, and AI assessment.</p>
                            <button type="button" aria-label="Get started with HackSim">Get Started</button>
                        </article>
                    </div>
                </section>
                {/* Skill Roadmap Module */}
                <section id="roadmap" className={`page${page === "roadmap" ? " active" : ""}`} tabIndex={0}>
                    <section className="module" role="region" aria-labelledby="roadmap-title">
                        <h2 id="roadmap-title">Skill Roadmap</h2>
                        <p>This interactive roadmap guides you through essential skills for engineering success.</p>
                        <p><em>(Feature coming soon!)</em></p>
                    </section>
                </section>
                {/* Resume Builder Module */}
                <section id="resume" className={`page${page === "resume" ? " active" : ""}`} tabIndex={0}>
                    <section className="module" role="region" aria-labelledby="resume-title">
                        <h2 id="resume-title">Resume Builder</h2>
                        <p>Create your professional resume with live editing and export options.</p>
                        <p><em>(Feature coming soon!)</em></p>
                    </section>
                </section>
                {/* HackSim Module */}
                <section id="hacksim" className={`page${page === "hacksim" ? " active" : ""}`} tabIndex={0}>
                    <section className="module" role="region" aria-labelledby="hacksim-title">
                        <h2 id="hacksim-title">HackSim: AI-Powered Hackathon Simulator</h2>
                        <p>Practice hackathons with real-world problems, code evaluation, and AI-powered assessment using Google Gemini.</p>
                        <div id="problem">
                            <h3>🧠 Problem: {currentProblem.title}</h3>
                            <p><strong>Description:</strong> {currentProblem.description}</p>
                            <p><strong>Requirements:</strong> {currentProblem.requirements}</p>
                            <p><strong>Tech Stack:</strong> {currentProblem.techStack}</p>
                            <p><em>⏰ Typical hackathon time: 24-48 hours</em></p>
                            <button type="button" style={{ marginTop: 10 }} onClick={generateProblem}>🔄 Generate New Problem</button>
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
                        <small style={{ color: "#9ca3af" }}>
                            Supported: .js, .py, .html, .css, .java, .cpp, .c, .php, .rb, .go, .ts, .jsx, .vue, .json, .md
                        </small>
                        <br /><br />
                        <button
                            onClick={submitPitch}
                            id="submitBtn"
                            disabled={loading}
                        >
                            {loading ? <span className="loading"></span> : "🚀 Submit for AI Evaluation"}
                            {loading && " Evaluating with AI..."}
                        </button>
                        <div id="feedback">{feedback}</div>
                    </section>
                </section>
            </main>
            <footer>
                <p>© 2025 SkillMate &nbsp;|&nbsp;
                    <a href="https://github.com/shubhangkuber" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a> •
                    <a href="https://linkedin.com/in/shubhangkuber" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
                </p>
            </footer>
        </>
    );
}

export default SkillMate;
// ...end of file...