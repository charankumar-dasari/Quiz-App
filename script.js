
// Questions
const questions = [
  {id:'CJ01',category:'Core Java',question:'What is JVM?',choices:['Java Virtual Machine','Java Verified Machine','Java Visual Machine','None'],answer:0},
  {id:'CJ02',category:'Core Java',question:'Which keyword is used to inherit a class in Java?',choices:['extends','implements','inherits','super'],answer:0},
  {id:'CJ03',category:'Core Java',question:'Which of these is not OOP concept?',choices:['Encapsulation','Abstraction','Polymorphism','Compilation'],answer:3},
  {id:'AJ01',category:'Advanced Java',question:'Which package contains JDBC classes?',choices:['java.sql','javax.sql','java.jdbc','sql.jdbc'],answer:0},
  {id:'AJ02',category:'Advanced Java',question:'Servlets run on?',choices:['Client','Server','Both','Browser'],answer:1},
  {id:'AJ03',category:'Advanced Java',question:'Which is used for session tracking?',choices:['Cookies','URL Rewriting','Hidden fields','All of these'],answer:3},
  {id:'H01',category:'HTML',question:'HTML stands for?',choices:['Hyperlinks and Text Markup Language','Hyper Text Markup Language','Home Tool Markup Language','None'],answer:1},
  {id:'H02',category:'HTML',question:'Which tag inserts a line break?',choices:['<break>','<br>','<lb>','<line>'],answer:1},
  {id:'H03',category:'HTML',question:'Which attribute sets image source?',choices:['src','href','alt','link'],answer:0},
  {id:'C01',category:'CSS',question:'CSS stands for?',choices:['Cascading Style Sheets','Colorful Style Sheets','Creative Style System','None'],answer:0},
  {id:'C02',category:'CSS',question:'Which property sets text color?',choices:['font-color','text-style','color','background-color'],answer:2},
  {id:'JS01',category:'JavaScript',question:'JavaScript is a ___ language?',choices:['Compiled','Interpreted','Assembly','Markup'],answer:1},
  {id:'JS02',category:'JavaScript',question:'Which symbol is used for comments?',choices:['//','<!--','**','##'],answer:0},
  {id:'JS03',category:'JavaScript',question:'Which method converts JSON to object?',choices:['JSON.parse()','JSON.stringify()','JSON.convert()','parse.JSON()'],answer:0},
  {id:'NG01',category:'Angular',question:'Angular is developed by?',choices:['Google','Facebook','Microsoft','Oracle'],answer:0},
  {id:'DB01',category:'MySQL',question:'Which command creates a DB?',choices:['MAKE DATABASE','CREATE DATABASE','NEW DATABASE','DB CREATE'],answer:1}
];

// State
let state = {
  pool: [],
  index: 0,
  score: 0,
  selected: [],
  category: 'All'
};

// Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const reviewScreen = document.getElementById('reviewScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');

const questionText = document.getElementById('questionText');
const choicesEl = document.getElementById('choices');
const progress = document.getElementById('progress');
const categoryLabel = document.getElementById('categoryLabel');
const scoreText = document.getElementById('scoreText');
const reviewList = document.getElementById('reviewList');
const leaderboardList = document.getElementById('leaderboardList');

// Buttons
document.querySelectorAll('.category-card').forEach(c =>
  c.addEventListener('click', () => startQuiz(c.dataset.category))
);

document.getElementById('nextBtn').addEventListener('click', () => {
  state.index++;
  showQuestion();
});

document.getElementById('restartBtn').addEventListener('click', () => location.reload());
document.getElementById('reviewBtn').addEventListener('click', () => showReview());
document.getElementById('leaderboardBtn').addEventListener('click', () => showLeaderboard());
document.getElementById('backHomeBtn').addEventListener('click', () => location.reload());
document.getElementById('backHomeBtn2').addEventListener('click', () => location.reload());

// Quiz Flow
function startQuiz(category) {
  state.category = category;

  state.pool = category === 'All'
    ? questions
    : [...questions.filter(q => q.category === category)];

  state.index = 0;
  state.score = 0;
  state.selected = new Array(state.pool.length).fill(null);

  startScreen.classList.add('d-none');
  quizScreen.classList.remove('d-none');

  showQuestion();
}

function showQuestion() {
  if (state.index >= state.pool.length) {
    return finishQuiz();
  }

  const q = state.pool[state.index];

  questionText.textContent = `Q${state.index + 1}. ${q.question}`;
  categoryLabel.textContent = `${q.category}`;

  progress.style.width =
    ((state.index / state.pool.length) * 100) + '%';

  choicesEl.innerHTML = '';

  q.choices.forEach((ch, i) => {
    const btn = document.createElement('div');

    btn.className = 'option';
    btn.textContent = ch;
    btn.dataset.idx = i;

    btn.onclick = () => selectOption(i);

    choicesEl.appendChild(btn);
  });
}

function selectOption(i) {
  const q = state.pool[state.index];

  state.selected[state.index] = i;

  if (i === q.answer) {
    state.score++;
  }

  [...choicesEl.children].forEach((c, idx) => {
    c.classList.add('disabled');

    if (idx === q.answer) {
      c.classList.add('correct');
    } else if (idx === i) {
      c.classList.add('wrong');
    }
  });
}

function finishQuiz() {
  quizScreen.classList.add('d-none');
  resultScreen.classList.remove('d-none');

  progress.style.width = '100%';

  scoreText.textContent =
    `You scored ${state.score} / ${state.pool.length}`;

  saveScore();
}

function showReview() {
  resultScreen.classList.add('d-none');
  reviewScreen.classList.remove('d-none');

  reviewList.innerHTML = '';

  state.pool.forEach((q, idx) => {
    const userAns = state.selected[idx];

    const div = document.createElement('div');

    div.className = 'mb-3';

    div.innerHTML = `
      <strong>Q${idx + 1}. ${q.question}</strong><br>

      <span class="review-answer ${userAns === q.answer ? 'correct' : 'wrong'}">
        Your Answer: ${userAns !== null ? q.choices[userAns] : 'Not answered'}
      </span><br>

      <span class="text-success">
        Correct Answer: ${q.choices[q.answer]}
      </span>
    `;

    reviewList.appendChild(div);
  });
}

// Leaderboard
function saveScore() {
  const name = prompt("Enter your name:");

  if (!name) return;

  const hs = JSON.parse(
    localStorage.getItem('quiz_highscores') || '[]'
  );

  hs.push({
    name,
    score: state.score,
    total: state.pool.length,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    'quiz_highscores',
    JSON.stringify(hs)
  );
}

function showLeaderboard() {
  resultScreen.classList.add('d-none');
  leaderboardScreen.classList.remove('d-none');

  leaderboardList.innerHTML = '';

  const hs = JSON.parse(
    localStorage.getItem('quiz_highscores') || '[]'
  );

  hs.sort((a, b) => b.score - a.score);

  hs.forEach(h => {
    const li = document.createElement('li');

    li.className = 'list-group-item';

    li.textContent =
      `${h.name} — ${h.score}/${h.total} (${h.date})`;

    leaderboardList.appendChild(li);
  });
}
