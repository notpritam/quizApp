// main.js
import "./style.css";
import { questions } from "./content/questions.js";
import { gsap } from "gsap";

let currentQuestionIndex = 0;
let score = 0;

function saveScore(score) {
  const quizResults = JSON.parse(localStorage.getItem("quizResults")) || [];
  quizResults.push({
    date: new Date().toLocaleString(),
    score: score,
  });
  localStorage.setItem("quizResults", JSON.stringify(quizResults));
}

function showQuestion() {
  const questionElement = document.querySelector("#question");
  const answersElement = document.querySelector("#answers");

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-button");
    button.addEventListener("click", () => selectAnswer(index, button));
    answersElement.appendChild(button);
  });
}

function selectAnswer(selectedIndex, button) {
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.correct;

  if (isCorrect) {
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("incorrect");
    const correctButton =
      document.querySelectorAll(".answer-button")[currentQuestion.correct];
    correctButton.classList.add("correct");
  }

  gsap.fromTo(
    button,
    { scale: 1 },
    { scale: 1.2, duration: 0.5, yoyo: true, repeat: 1 }
  );

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  saveScore(score);
  const quizContainer = document.querySelector("#quiz-container");
  quizContainer.innerHTML = `
    <h2>Your score is ${score} out of ${questions.length}</h2>
    <button class="start-quiz-btn" id="restart-quiz" type="button">Restart Quiz</button>
    <button  class="start-quiz-btn" id="back-to-main" type="button">Back to Main</button>
  `;
  document
    .querySelector("#restart-quiz")
    .addEventListener("click", restartQuiz);
  document
    .querySelector("#back-to-main")
    .addEventListener("click", showMainScreen);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  initQuiz();
}

function initQuiz() {
  document.querySelector("#app").innerHTML = `
    <div id="quiz-container">
      <h1>Quizify</h1>
      <div id="question-container">
        <p id="question"></p>
        <div id="answers"></div>
      </div>
    </div>
  `;
  showQuestion();
}

function showMainScreen() {
  const quizResults = JSON.parse(localStorage.getItem("quizResults")) || [];

  const resultsHtml = quizResults
    .map((result) => {
      const date = new Date(result.date);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      return `
        <li>Quiz on ${formattedDate}: Scored ${result.score}</li>
      `;
    })
    .join("");

  document.querySelector("#app").innerHTML = `
    <div>
      <h1>Quizify</h1>
      
        <button class="start-quiz-btn" id="start-quiz" type="button">Start Quiz ⏲️</button>
     
      <p class="read-the-docs">
        Test your knowledge of Web Development by clicking the button above.
      </p>
      <h2>Previous Quiz Results</h2>
      <ul>
        ${resultsHtml}
      </ul>
    </div>
  `;

  document.querySelector("#start-quiz").addEventListener("click", initQuiz);
}

// Initialize the main screen on load
showMainScreen();
