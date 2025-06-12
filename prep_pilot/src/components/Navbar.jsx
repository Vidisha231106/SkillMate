import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <div className="menu-bar">
      <div className="menu-container">
        <Link to="/" className="menu-logo">SkillMate</Link>
        <div className="menu-links">
          <Link 
            to="/" 
            className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link 
            to="/roadmap" 
            className={`menu-link ${location.pathname === "/roadmap" ? "active" : ""}`}
          >
            Skill Roadmap
          </Link>
          <Link 
            to="/resources" 
            className={`menu-link ${location.pathname === "/resources" ? "active" : ""}`}
          >
            Resources
          </Link>
          <Link 
            to="/flowchart" 
            className={`menu-link ${location.pathname === "/flowchart" ? "active" : ""}`}
          >
            HackSim
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar; 