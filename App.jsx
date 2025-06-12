import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./HomePage";
import QuizPage from "./QuizPage";
import Final from "./Final";
import Flowchart from "./Flowchart";
import ResPage from "./ResPage";
import SkillMateHacksim from "./SkillMate_Hacksim";
import AppResume from "./AppResume";
import "./App.css";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/roadmap" element={<QuizPage />} />
        <Route path="/appresume" element={<AppResume />} />
        <Route path="/resources" element={<ResPage />} />
        <Route path="/flowchart" element={<Flowchart />} />
        <Route path="/final" element={<Final />} />
        <Route path="/hacksim" element={<SkillMateHacksim />} />
      </Routes>
    </Layout>
  );
}