import React, { useState, useRef } from "react";

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
    const [currentProblem, setCurrentProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);
    const [pitch, setPitch] = useState("");
    const [files, setFiles] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();

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
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{evaluation}</pre>
                    </div>
                </>
            );
        } catch (error) {
            setFeedback(
                <div className="error-message">
                    ❌ Error analyzing submission: {error.message}
                </div>
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="hacksim-container">
            <div className="problem-section">
                <h2>🎯 Problem Statement</h2>
                <div className="problem-card">
                    <h3>{currentProblem.title}</h3>
                    <p>{currentProblem.description}</p>
                    <div className="requirements">
                        <h4>Requirements:</h4>
                        <p>{currentProblem.requirements}</p>
                    </div>
                    <div className="tech-stack">
                        <h4>Suggested Tech Stack:</h4>
                        <p>{currentProblem.techStack}</p>
                    </div>
                    <button 
                        className="btn"
                        onClick={generateProblem}
                        style={{ marginTop: "1rem" }}
                    >
                        Generate New Problem
                    </button>
                </div>
            </div>

            <div className="submission-section">
                <h2>📝 Your Solution</h2>
                <div className="submission-form">
                    <div className="form-group">
                        <label>Solution Pitch:</label>
                        <textarea
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                            placeholder="Describe your solution approach, key features, and how it addresses the problem..."
                            rows={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Code Files:</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                            multiple
                            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json"
                        />
                        <small>Upload your source code files (max 5 files)</small>
                    </div>

                    <button 
                        className="btn"
                        onClick={submitPitch}
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Submit Solution"}
                    </button>
                </div>
            </div>

            {feedback && (
                <div className="feedback-section">
                    {feedback}
                </div>
            )}
        </div>
    );
}

export default SkillMate;