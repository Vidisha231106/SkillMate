import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function MenuBar() {
  return (
    <nav className="menu-bar">
      <div className="menu-container">
        <Link to="/" className="menu-logo">SkillMate</Link>
        <div className="menu-links">
          <Link to="/" className="menu-link">Home</Link>
          <Link to="/roadmap" className="menu-link">Roadmap</Link>
          <Link to="/resources" className="menu-link">Resources</Link>
          <Link to="/flowchart" className="menu-link">Flowchart</Link>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;