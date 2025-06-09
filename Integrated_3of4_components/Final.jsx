import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// --- Flowchart prerequisites data ---
const prerequisites = [
    {
        number: 1,
        icon: "💻",
        title: "Working Code Files",
        description:
            "Upload all source code files (HTML, CSS, JS, Python, etc.). Code should run without major errors with main/entry file clearly labeled.",
    },
    {
        number: 2,
        icon: "📖",
        title: "README File",
        description:
            "Simple project description explaining what it does, basic setup/installation instructions, and how to run the project.",
    },
    {
        number: 3,
        icon: "🎯",
        title: "Problem-Solution Match",
        description:
            "Your code should address the generated problem statement with clear connection between challenge and your functional prototype approach.",
    },
    {
        number: 4,
        icon: "🎤",
        title: "Pitch Description",
        description:
            "2-3 paragraph explanation of your solution, why your approach solves the problem, and key features and benefits.",
    },
    {
        number: 5,
        icon: "📁",
        title: "File Organization",
        description:
            "Organized folder structure with related files grouped together and clear naming conventions (no random file names).",
    },
    {
        number: 6,
        icon: "📦",
        title: "Dependencies List",
        description:
            "List of required libraries/frameworks, version requirements (if critical), and installation commands (npm install, pip install, etc.).",
    },
    {
        number: 7,
        icon: "🖼️",
        title: "Demo Evidence",
        description:
            "Screenshots of working application OR simple screen recording/video that shows the solution actually works.",
    },
    {
        number: 8,
        icon: "🧹",
        title: "Clean Code",
        description:
            "Remove debugging code and console.logs, no hardcoded sensitive data (API keys, passwords), and basic comments for key functions.",
    },
    {
        number: 9,
        icon: "✅",
        title: "Error-Free Execution",
        description:
            "Test your code runs on a fresh setup, handle basic user input errors, and ensure no crashes on normal usage.",
    },
    {
        number: 10,
        icon: "📋",
        title: "Submission Completeness",
        description:
            "All required files uploaded, pitch text filled out completely, files are not corrupted or empty, submission confirmed before deadline.",
    },
];

// --- HackSim problems data ---
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

const GEMINI_API_KEY = "AIzaSyDEpQJRblQngw-UclzPg98LkyXHu6QGtB0"; // For demo only

// --- Flowchart Component ---
function Flowchart({ onContinue }) {
    const cardsRef = useRef([]);

    useEffect(() => {
        cardsRef.current.forEach((card, idx) => {
            if (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(30px)";
                setTimeout(() => {
                    card.style.transition = "all 0.6s cubic-bezier(.4,2,.6,1)";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, idx * 100);
            }
        });
    }, []);

    return (
        <div className="container">
            <div className="header">
                <h1>🚀 HackSim Prerequisites Flowchart</h1>
                <p>Essential checklist for smooth hackathon submission in HackSim platform</p>
            </div>
            <div className="flowchart">
                <div className="flow-arrow"></div>
                <div className="prerequisites-grid fade-in">
                    {prerequisites.map((card, idx) => (
                        <div
                            className="prerequisite-card"
                            key={card.number}
                            ref={el => (cardsRef.current[idx] = el)}
                        >
                            <div className="card-number">{card.number}</div>
                            <div className="card-title">
                                <span className="card-icon">{card.icon}</span>
                                {card.title}
                            </div>
                            <div className="card-description">{card.description}</div>
                        </div>
                    ))}
                </div>
                <div className="connecting-line"></div>
                <button className="continue-button" onClick={onContinue}>
                    🚀 Continue to HackSim
                </button>
            </div>
        </div>
    );
}

// --- HackSim Component ---
function HackSim() {
    const [currentProblem, setCurrentProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);
    const [pitch, setPitch] = useState("");
    const [files, setFiles] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

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

    function generateProblem() {
        setCurrentProblem(problems[Math.floor(Math.random() * problems.length)]);
        setFeedback("");
    }

    return (
        <main className="container">
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
        </main>
    );
}

// --- Main SkillMateHacksim App ---
function SkillMateHacksim() {
    const [page, setPage] = useState("home"); // home | roadmap | resume | flowchart | hacksim

    // Navigation handler
    function handleNav(target) {
        setPage(target);
    }

    // "Get Started" for HackSim goes to flowchart
    function handleHackSimStart() {
        setPage("flowchart");
    }

    // After flowchart, go to HackSim
    function handleFlowchartContinue() {
        setPage("hacksim");
    }

    // --- CSS for all sections ---
    return (
        <>
            <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          line-height: 1.5;
        }
        a {
          color: #38bdf8;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        a:hover, a:focus {
          color: #0ea5e9;
        }
        button {
          background: #38bdf8;
          border: none;
          padding: 0.7rem 1.5rem;
          color: white;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover, button:focus {
          background-color: #0ea5e9;
        }
        button:disabled {
          background-color: #64748b;
          cursor: not-allowed;
        }
        h1, h2, h3 {
          margin: 0 0 1rem 0;
          font-weight: 700;
        }
        p {
          margin: 0 0 1rem 0;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1rem 1.5rem 4rem;
        }
        header {
          background-color: #1e293b;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.7);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .logo {
          font-size: 1.75rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 2px;
        }
        nav a {
          margin-left: 2rem;
          font-weight: 600;
          font-size: 1rem;
        }
        nav a.active {
          color: #0ea5e9;
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 0.15rem;
        }
        .page { display: none; }
        .page.active { display: block; }
        #home .welcome {
          text-align: center;
          margin: 3rem 0 4rem;
        }
        #home .welcome h1 {
          font-size: 2.8rem;
          color: #38bdf8;
        }
        #home .welcome p {
          font-size: 1.3rem;
          color: #94a3b8;
        }
        .cards {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
        }
        .card {
          background: #1e293b;
          flex: 1 1 280px;
          max-width: 320px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.6);
          padding: 2rem 1.8rem;
          text-align: center;
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .card:hover, .card:focus {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.9);
        }
        .card-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          color: #38bdf8;
        }
        .card h3 {
          margin-bottom: 1rem;
          font-size: 1.6rem;
        }
        .card p {
          color: #94a3b8;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        .card button {
          width: 100%;
          font-size: 1rem;
        }
        section.module {
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.6);
          padding: 2rem 2.5rem;
          max-width: 900px;
          margin: 2rem auto;
        }
        section.module h2 {
          color: #38bdf8;
          margin-bottom: 1rem;
          text-align: center;
        }
        section.module p {
          color: #cbd5e1;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        footer {
          background-color: #1e293b;
          text-align: center;
          padding: 1.5rem 1rem;
          font-size: 0.9rem;
          color: #94a3b8;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }
        footer a {
          margin: 0 0.5rem;
          font-size: 1.2rem;
        }
        @media (max-width: 768px) {
          .cards {
            flex-direction: column;
            align-items: center;
          }
          nav a {
            margin-left: 1rem;
            font-size: 0.9rem;
          }
        }
        /* Flowchart styles */
        .container.flowchart-container {
          max-width: 1400px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .header h1 {
          font-size: 2.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        .header p {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }
        .flowchart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
        }
        .flow-arrow {
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 25px solid #667eea;
          margin: 1rem 0;
          opacity: 0.8;
        }
        .prerequisites-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 1000px;
          width: 100%;
          margin: 2rem 0;
        }
        .prerequisite-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          opacity: 1;
          transform: translateY(0);
        }
        .prerequisite-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }
        .prerequisite-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .card-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-description {
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .card-icon {
          font-size: 1.5rem;
        }
        .connecting-line {
          width: 3px;
          height: 50px;
          background: linear-gradient(to bottom, #667eea, #764ba2);
          margin: 0 auto;
          opacity: 0.6;
        }
        .continue-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          font-size: 1.3rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          font-family: inherit;
        }
        .continue-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
        .continue-button:active {
          transform: translateY(-1px);
        }
        /* HackSim styles */
        #hacksim textarea, #hacksim input[type="file"] {
          width: 100%;
          margin: 10px 0 20px 0;
          font-size: 1rem;
          padding: 0.8rem;
          border-radius: 6px;
          border: 2px solid #374151;
          background: #111827;
          color: #f8fafc;
        }
        #hacksim textarea:focus, #hacksim input[type="file"]:focus {
          outline: none;
          border-color: #38bdf8;
        }
        #hacksim label {
          display: block;
          font-weight: 600;
          color: #f8fafc;
          margin: 1rem 0 0.5rem 0;
        }
        #hacksim button {
          margin-top: 10px;
          margin-right: 10px;
        }
        #feedback {
          background: #111827;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
          margin-top: 20px;
          white-space: pre-wrap;
          color: #f8fafc;
          font-family: 'Courier New', monospace;
          line-height: 1.6;
        }
        #problem {
          background: #1e293b;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #38bdf8;
          margin: 20px 0;
          font-weight: bold;
          color: #f8fafc;
        }
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #64748b;
          border-radius: 50%;
          border-top-color: #38bdf8;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .score-card {
          background: #1e293b;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #10b981;
        }
        .score-value {
          font-size: 2rem;
          font-weight: bold;
          color: #10b981;
        }
        .error-message {
          background: #7f1d1d;
          color: #fecaca;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #dc2626;
          margin: 1rem 0;
        }
        @media (max-width: 768px) {
          .prerequisites-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .container {
            padding: 2rem 1rem;
          }
          .header h1 {
            font-size: 2rem;
          }
        }
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
                        <article className="card" role="listitem" tabIndex={0} data-module="roadmap" onClick={() => handleNav("roadmap")}>
                            <div className="card-icon" aria-hidden="true">📖</div>
                            <h3>Skill Roadmap</h3>
                            <p>Interactive guides through essential technical and soft skills.</p>
                            <button type="button" aria-label="Get started with Skill Roadmap">Get Started</button>
                        </article>
                        <article className="card" role="listitem" tabIndex={0} data-module="resume" onClick={() => handleNav("resume")}>
                            <div className="card-icon" aria-hidden="true">📄</div>
                            <h3>Resume Builder</h3>
                            <p>Create professional resumes with live preview and PDF export.</p>
                            <button type="button" aria-label="Get started with Resume Builder">Get Started</button>
                        </article>
                        <article className="card" role="listitem" tabIndex={0} data-module="hacksim" onClick={handleHackSimStart}>
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
                {/* Flowchart Section */}
                <section id="flowchart" className={`page${page === "flowchart" ? " active" : ""}`}>
                    {page === "flowchart" && <Flowchart onContinue={handleFlowchartContinue} />}
                </section>
                {/* HackSim Section */}
                <section id="hacksim" className={`page${page === "hacksim" ? " active" : ""}`}>
                    {page === "hacksim" && <HackSim />}
                </section>
            </main>
            <footer>
                <p>© 2025 SkillMate  |
                    <a href="https://github.com/shubhangkuber" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a> -
                    <a href="https://linkedin.com/in/shubhangkuber" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
                </p>
            </footer>
        </>
    );
}

export default SkillMateHacksim;