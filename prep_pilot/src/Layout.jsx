import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css"; // Make sure your menu bar CSS is here

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <div className="tech-bg">
      <nav className="menu-bar">
        <div className="menu-container">
          <Link to="/" className="menu-logo">SkillMate</Link>
          <div className="menu-links">
            <Link to="/" className={`menu-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
            <Link 
                to="/roadmap" 
                className={`menu-link ${location.pathname === "/roadmap" ? "active" : ""}`}
                onClick={() => handleNav("roadmap")}
            >
                Skill Roadmap
            </Link>
            <Link 
                to="/appresume" 
                className={`menu-link ${location.pathname === "/resume" ? "active" : ""}`}
                onClick={() => handleNav("resume")}
            >
                Resume Builder
            </Link>
            <Link 
                to="/flowchart" 
                className={`menu-link ${location.pathname === "/flowchart" ? "active" : ""}`}
                onClick={() => handleNav("hacksim")}
            >
                HackSim
            </Link>
            <Link to="/resources" className={`menu-link ${location.pathname === "/resources" ? "active" : ""}`}>Resources</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}