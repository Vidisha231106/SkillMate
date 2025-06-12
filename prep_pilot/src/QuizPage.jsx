import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import questionsTechnical from "./questionsTechnical";
import questionsNonTechnical from "./questionsNonTechnical";

const initialScores = {
  AIML: 0,
  "Data Science": 0,
  "Cyber Security": 0,
  Aerospace: 0,
  "Information Science": 0,
  Mechanical: 0,
  Mathematics: 0,
  Physics: 0,
  Chemistry: 0,
  Civil: 0,
  Electronics: 0,
  "Web/App Dev": 0,
  "Gen AI": 0,
  "UI/UX Design": 0,
  "DSA,CP": 0,
  "Cloud Computing": 0,
  "Full Stack": 0,
  General: 0
};

function QuizPage() {

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scores, setScores] = useState(initialScores);
  const [answers, setAnswers] = useState([]);
  const [quizType, setQuizType] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();

  // Reset quiz state when page is reloaded
  useEffect(() => {
    const resetQuizState = () => {
      setQuizType(null);
      setCurrent(0);
      setAnswers([]);
      setShowAnswer(false);
      setScores(initialScores);
      setQuizCompleted(false);
    };

    window.addEventListener('load', resetQuizState);

    return () => {
      window.removeEventListener('load', resetQuizState);
    };
  }, []);

  // Move questions definition outside of conditional rendering
  const questions = quizType === "technical" 
    ? questionsTechnical 
    : quizType === "nonTechnical" 
    ? questionsNonTechnical 
    : [];

  // Load saved state on component mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('quizState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setCurrent(parsedState.current || 0);
        setSelected(parsedState.selected || null);
        setShowAnswer(parsedState.showAnswer || false);
        setScores(parsedState.scores || initialScores);
        setAnswers(parsedState.answers || []);
        setQuizType(parsedState.quizType || null);
        setQuizCompleted(parsedState.quizCompleted || false);
      } catch (error) {
        console.error('Error loading saved quiz state:', error);
      }
    }
  }, []);

  // Save state whenever it changes (except on initial load)
  useEffect(() => {
    if (quizType) { // Only save if quiz has been started
      const stateToSave = {
        current,
        selected,
        showAnswer,
        scores,
        answers,
        quizType,
        quizCompleted
      };
      sessionStorage.setItem('quizState', JSON.stringify(stateToSave));
    }
  }, [current, selected, showAnswer, scores, answers, quizType, quizCompleted]);

  useEffect(() => {
    // Reset answers array when quizType changes
    if (quizType && questions.length > 0 && !quizCompleted) {
      setAnswers(Array(questions.length).fill(null));
      setCurrent(0);
      setSelected(null);
      setShowAnswer(false);
      setScores(initialScores);
    }
  }, [quizType, questions.length, quizCompleted]);

  const handleOptionClick = (idx) => {
    // If user had already selected an answer for this question, decrement its score
    if (answers[current] !== null) {
      const prevSubject = questions[current].options[answers[current]].subject;
      setScores((prev) => ({
        ...prev,
        [prevSubject]: Math.max(0, prev[prevSubject] - 1),
      }));
    }

    setSelected(idx);
    setShowAnswer(true);

    // Update answers
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = idx;
      return updated;
    });

    // Increment the relevant subject's score
    const subject = questions[current].options[idx].subject;
    setScores((prev) => ({
      ...prev,
      [subject]: prev[subject] + 1,
    }));
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(answers[current + 1]);
    setShowAnswer(answers[current + 1] !== null);
  };

  const handlePrevious = () => {
    if (current > 0) {
      const prevIdx = current - 1;
      setCurrent(prevIdx);
      setSelected(answers[prevIdx]);
      setShowAnswer(answers[prevIdx] !== null);
    }
  };

  const handleSubmit = () => {
    setCurrent(current + 1);
    setQuizCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setScores(initialScores);
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);
    setQuizType(null);
    setAnswers([]);
    setQuizCompleted(false);
    // Clear saved state
    sessionStorage.removeItem('quizState');
  };

  const quizOver = current >= questions.length && questions.length > 0;

  // Quiz type selection screen
  if (!quizType) {
    return (
      <section className="module quiz-module">
        <div className="quiz-type-container">
          <h1>Choose Your Quiz Type</h1>
          <p>Select the type of quiz you want to take to discover your interests</p>
          
          <div className="quiz-type-cards">
            <div 
              className="quiz-type-card technical"
              onClick={() => setQuizType("technical")}
            >
              <div className="card-icon">💻</div>
              <h2>Technical Quiz</h2>
              <p>Test your knowledge in programming, algorithms, and technical concepts</p>
              <ul>
                <li>Programming Languages</li>
                <li>Data Structures</li>
                <li>Algorithms</li>
                <li>System Design</li>
              </ul>
              <button className="start-quiz-btn">Start Technical Quiz</button>
            </div>
            
            <div 
              className="quiz-type-card non-technical"
              onClick={() => setQuizType("nonTechnical")}
            >
              <div className="card-icon">🎯</div>
              <h2>Non-Technical Quiz</h2>
              <p>Explore your interests in design, management, and soft skills</p>
              <ul>
                <li>UI/UX Design</li>
                <li>Project Management</li>
                <li>Communication</li>
                <li>Problem Solving</li>
              </ul>
              <button className="start-quiz-btn">Start Non-Technical Quiz</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no questions available, show error
  if (questions.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "black",
        color: "white",
        textAlign: "center"
      }}>
        <div>
          <h2>Error: No questions found!</h2>
          <p>Please check your question files.</p>
          <button 
            onClick={() => setQuizType(null)}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#646cff",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-module">
      <div className="quiz-content">
        <div className="quiz-header">
          <h1>🚀 Skill Discovery Quiz</h1>
          <div className="quiz-subtitle">
            Multiple-choice quiz to suggest suitable tech domains.
          </div>
        </div>
        
        {!quizOver && (
          <div className="quiz-question-container">
            <h2>Question {current + 1}</h2>
            <p>{q.question}</p>
            <ul className="quiz-options">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleOptionClick(idx)}
                    disabled={showAnswer}
                    className={`quiz-option ${selected === idx ? 'selected' : ''}`}
                  >
                    {opt.text}
                  </button>
                </li>
              ))}
            </ul>
            
            {showAnswer && (
              <div className="quiz-navigation">
                <div className="nav-buttons">
                  <button
                    onClick={handlePrevious}
                    disabled={current === 0 || !showAnswer}
                    className="nav-button"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={current === questions.length - 1 || !showAnswer}
                    className="nav-button"
                  >
                    Next
                  </button>
                </div>
                <div className="submit-container">
                  {current === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={answers[current] === null || !showAnswer}
                      className="submit-button"
                    >
                      Submit
                    </button>
                  ) : (
                    <div className="submit-placeholder" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Mini live bar graph */}
        {!quizOver && (
          <div className="score-graph">
            {Object.values(scores).map((score, idx) => {
              const maxScore = Math.max(1, ...Object.values(scores));
              return (
                <div
                  key={idx}
                  className="score-bar"
                  style={{
                    height: `${(score / maxScore) * 48}px`,
                    background: score > 0 ? "#646cff" : "#333",
                  }}
                  title={`Score: ${score}`}
                />
              );
            })}
          </div>
        )}
        
        {quizOver && (
          <div className="quiz-results">
            <h3>Your Skill Quiz Results</h3>
            <div className="results-container">
              {Object.entries(scores)
                .filter(([_, score]) => score > 0)
                .map(([domain, score], _, arr) => {
                  const maxScore = Math.max(...arr.map(([_, s]) => s));
                  const barWidth = (score / maxScore) * 250;
                  return (
                    <div key={domain} className="result-item">
                      <span className="domain-name">{domain}</span>
                      <div className="result-bar-container">
                        <div
                          className="result-bar"
                          style={{
                            width: `${barWidth}px`,
                          }}
                          title={`${domain}: ${score}`}
                        >
                          <span className="score-value">{score}</span>
                        </div>
                      </div>
                      <div className="resource-button-container">
                        <button
                          className="resource-button"
                          onClick={() => {
                            navigate("/resources", { 
                              state: { 
                                highlightDomain: domain,
                                fromQuiz: true 
                              } 
                            });
                          }}
                        >
                          Resources
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={handleRetakeQuiz}
              className="retake-button"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;

