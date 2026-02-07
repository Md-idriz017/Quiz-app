import {questions, userAnswer} from './data/script.js';

let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
const appEl = document.querySelector('.js-app');

function renderApp(){
    appEl.innerHTML = `
      <!-- START SCREEN -->
        <div class="screen js-screen js-start">
          <h1>Quiz App</h1>
          <p>Test your JavaScript knowledge</p>
          <button class="btn primary js-start-btn">Start Quiz</button>
        </div>
    
        <!-- QUESTION SCREEN -->
        <div class="screen js-question hidden">
        </div>
    
        <!-- RESULT SCREEN -->
        <div class="screen js-result hidden">
          <h2>Quiz Result</h2>
          <p class="score js-score">Score: ${score} / ${questions.length}</p>
          <button class="btn primary js-restart">Restart Quiz</button>
          <button class="btn js-show-answer">Show Answer</button>
        </div>
        
        <div class="js-answer-review hidden"></div>
        <div class="back-btn">
            <button class="btn js-back hidden">Back</button>
        </div>
    `;
    
    document.querySelector('.js-start-btn')
        .addEventListener('click', () => {
        const startScreen = document.querySelector('.js-screen');
        const questScreen = document.querySelector('.js-question');
        
        startScreen.classList.add('hidden');
        questScreen.classList.remove('hidden');
    });
}

renderApp();
renderQuestion();

function renderQuestion(){
    let currentQuestion = questions[currentIndex];
    
    const questScreen = document.querySelector('.js-question');
    
    questScreen.innerHTML = `
        <div class="js-container">
          <div class="top">
            <span class="js-progress">Question ${currentIndex + 1} / ${questions.length}</span>
          </div>
    
          <p class="question js-question-text">
            ${currentQuestion.question}
          </p>
    
          <div class="options js-options">
          </div>
    
          <button class="btn next js-next hidden"
            data-correct="${currentQuestion.correct}">Next</button>
        </div>
    `;
    
    selectedAnswer = null;
    document.querySelector('.js-next').classList.add('hidden');
    
    const optionEl = document.querySelector('.js-options');
    
    if(currentQuestion.type === 'mcq'){
        currentQuestion.options.forEach((option) => {
            optionEl.innerHTML += `
                <button class="option js-option">${option}</button>
            `;
        });
    } else if(currentQuestion.type === 'tf'){
        optionEl.innerHTML = `
            <button class="option js-option">True</button>
            <button class="option js-option">False</button>
        `;
    }
}

document.querySelector('.js-question')
    .addEventListener('click', (e) => {
        let currentQuestion = questions[currentIndex]
        let currentOption = currentQuestion.options;
        
        const optCont = e.target.closest('.js-options');
        const container = e.target.closest('.js-container');
        const option = e.target.closest('.js-option');
        const nextBtn = container.querySelector('.js-next');
        
        
        if(option){
            // e.stopPropagation();
            document.querySelectorAll('.js-option')
            .forEach((optionEl) => {
                optionEl.classList.remove('highlight');
            });
            
            selectedAnswer = e.target.innerText;
            option.classList.add('highlight');
            nextBtn.classList.remove('hidden');
        }
        
        if(e.target.classList.contains('js-next')){
            console.log(selectedAnswer);
            if(selectedAnswer === null) return;
            
            const correct = nextBtn.dataset.correct;
            
            userAnswer.push(selectedAnswer);
            
            if(selectedAnswer === currentQuestion.options[correct]){
                    score++;
            };
            
            currentIndex++;
            
            if(currentIndex >= questions.length){
                showResult();
                return;
            };
            renderQuestion();
        }
    });

document.querySelector('.js-restart')
    .addEventListener('click', () => {
        const reviewEl = document.querySelector('.js-answer-review');
        userAnswer.length = 0;
        currentIndex = 0;
        score = 0;
        selectedAnswer = null;
        
        showQuestion();
        renderQuestion();
    });

document.querySelector('.js-show-answer')
    .addEventListener('click', () => {
        const resultEl = document.querySelector('.js-result');
        const backEl = document.querySelector('.js-back');
        const reviewEl = document.querySelector('.js-answer-review');
        reviewEl.innerHTML = '';
        questions.forEach((q, index) => {
            const correctAnswer = q.options[q.correct];
            const userSelectedAnswer = userAnswer[index];
            const isCorrect = correctAnswer === userSelectedAnswer;
            
            const icon = isCorrect ? '✔️' : '❌';
            
            reviewEl.innerHTML += `
                <div class="answer-review">
                    <p class="question"><strong>Q${index + 1}) </strong>${q.question}</p>
                    <p class="icon-show ${isCorrect ? 'correct' : 'wrong'}">
                        Your Answer: ${userSelectedAnswer}
                        <span class="icon">${icon}</span>
                    </p>
                    <p class="correct">Correct Answer: ${correctAnswer}</p>
                </div>
            `;
        });
        resultEl.classList.add('hidden');
        reviewEl.classList.remove('hidden');
        backEl.classList.remove('hidden');
    });

document.querySelector('.js-back')
    .addEventListener('click', () => {
        const resultEl = document.querySelector('.js-result');
        const backEl = document.querySelector('.js-back');
        const reviewEl = document.querySelector('.js-answer-review');
        reviewEl.innerHTML = '';
        resultEl.classList.remove('hidden');
        reviewEl.classList.add('hidden');
        backEl.classList.add('hidden');
    });

function showResult(){
    const resultEl = document.querySelector('.js-result');
    const questScreen = document.querySelector('.js-question');
    
    resultEl.classList.remove('hidden');
    questScreen.classList.add('hidden');
    
    document.querySelector('.js-score')
        .textContent = `Score: ${score} / ${questions.length}`;
}

function showQuestion(){
    const resultEl = document.querySelector('.js-result');
    const startScreen = document.querySelector('.js-screen');
    resultEl.classList.add('hidden');
    startScreen.classList.remove('hidden');
}
