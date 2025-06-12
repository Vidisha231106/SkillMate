import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';

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

function Flowchart() {
  const [showHackSim, setShowHackSim] = useState(false);
  const cardRefs = useRef({});
  const navigate = useNavigate();

  // Reset flowchart state when page is reloaded
  useEffect(() => {
    const resetFlowchartState = () => {
      setShowHackSim(false);
      // Reset any animations or transitions
      const cards = document.querySelectorAll('.prerequisite-card');
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
      });
    };

    // Initial animation
    const cards = document.querySelectorAll('.prerequisite-card');
    cards.forEach((card, idx) => {
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

    window.addEventListener('load', resetFlowchartState);
    return () => {
      window.removeEventListener('load', resetFlowchartState);
    };
  }, []);

  const handleContinue = () => {
    navigate("/hacksim");
  };

  return (
    <div className="flowchart-module">
      <Navbar />
      <div className="header">
        <h1>Hackathon Submission Checklist</h1>
        <p>Ensure you have all these elements ready before submitting your hackathon project</p>
      </div>
      
      <div className="prerequisites-grid">
        {prerequisites.map((prerequisite, index) => (
          <div
            key={prerequisite.number}
            className="prerequisite-card"
            ref={el => cardRefs.current[index] = el}
          >
            <div className="card-number">{prerequisite.number}</div>
            <div className="card-icon">{prerequisite.icon}</div>
            <h3>{prerequisite.title}</h3>
            <p>{prerequisite.description}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="btn"
          onClick={handleContinue}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
        >
          Continue to HackSim
        </button>
      </div>
    </div>
  );
}

export default Flowchart;