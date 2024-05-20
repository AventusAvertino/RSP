'use strict';

//___________________________________________

// Инициализация DOM элементов
const handsBlue = document.getElementById('handsBlue');
const handsRed = document.getElementById('handsRed');

let start = document.getElementById('start');
let buttonPressed = document.getElementsByClassName('.button');

const chooseButton = document.getElementById('chooseButtons');

let buttonClick = false;

const bidSelector = document.getElementById('bidSelector');

// Инициализация переменных для счетчиков 
let playerScore = 0;
let computerScore = 0;
let playerChoice;
let computerChoice;

//___________________________________________
// Обработчики событий на кнопки для ставок
const bankScoreElement = document.getElementById('bankScore');
const scoreCountElement = document.getElementById('scoreCount');
let previousScore = scoreCountElement.textContent;

async function updateBankScoreWithDelay(amount, amountEnemy) {
  checkScore();
  await new Promise(resolve => setTimeout(resolve, 100)); // Задержка в 1 секунду
  bankScoreElement.textContent = parseInt(bankScoreElement.textContent) + amount + amountEnemy;
}

function checkScore() {
  const scoreCount = Math.max(parseInt(scoreCountElement.textContent, 10) || 0, 0);
  if (scoreCount <= 0) {
    scoreCountElement.style.color = 'rgba(239, 94, 112, 1)';
    scoreCount = 0;
  }
}

//Слушатель для блока со ставками
bidSelector.addEventListener('click', async function(event) {
  const amount = parseInt(event.target.dataset.counter);
  await updateBankScoreWithDelay(amount, amount);
  const scoreCount = Math.max(parseInt(scoreCountElement.textContent, 10) || 0, 0);
  scoreCountElement.textContent = scoreCount - amount;

  scoreGameOver(scoreCountElement);
  handleStartButtonClick();
  
});

//Слушатель для блока с выбором оружия
let weaponString;

chooseButton.addEventListener('click', function(event) {
  const weapon = event.target.id;
  weaponString = weapon.toString();

  buttonClick = true;
  handsBlue.style.backgroundImage = `url(../RSP/img/${weapon}.svg)`;

  console.log('Игрок выбрал:', weaponString);

  handleStartButtonClick();
})

//___________________________________________

// Обработчик события на кнопку start

let player;

function handleStartButtonClick() {

  if ((buttonClick) && scoreCountElement.textContent !== previousScore) {
    start.value = 'Fight!';
    start.classList.add('fight');
    previousScore = scoreCountElement.textContent;

  } else {
    start.value = 'Ready';
    start.classList.remove('fight');
  }
}

//Переменные с картинками для компьютера
const rockRed = '../RSP/img/rockRed.svg';
const scissorsRed = '../RSP/img/scissorsRed.svg';
const paperRed = '../RSP/img/paperRed.svg';

//___________________________________________

//Функция для запуска игры
function fightStarting() {

//Объявляем переменные с преобразованными строками от игрока и компа
  player = weaponString;
  const computer = chooseRandomImage(rockRed, scissorsRed, paperRed);
  
  //Запускаем функцию выбора победителя ()
  winnerSelection(player, computer);
  console.log('Выбор игрока:', player, 'Выбор компа:', computer);

  //Анимация на кнопку start
  const fightElement = document.querySelector('#start.fight');

  if (fightElement) {
    fightElement.style.animation = 'none';
    void fightElement.offsetWidth; 
    fightElement.style.animation = 'shadowPulse 0.2s ease-in-out';
  }

}

// Функция для генерации случайного выбора компьютера
function chooseRandomImage(rockRed, scissorsRed, paperRed) {
  const randomIndex = Math.floor(Math.random() * 3);

  if (randomIndex === 0) {
      handsRed.style.backgroundImage = `url('${rockRed}')`;
      return 'rockRed';
  } else if (randomIndex === 1) { 
      handsRed.style.backgroundImage = `url('${scissorsRed}')`;
      return 'scissorsRed';
  } else {
      handsRed.style.backgroundImage = `url('${paperRed}')`;
      return 'paperRed';
  }   
}

start.addEventListener('click', fightStarting);

// Счетчики для игроков
function counterWin(isPlayerWin) {
  const playerWinsScore = document.getElementById('playerWinsScore');
  const playerCounter = parseInt(playerWinsScore.textContent);

  if (isPlayerWin && playerCounter < 3) {
    playerWinsScore.textContent = '';
    console.log('Обнулил строку');
    playerWinsScore.textContent = playerCounter + 1;
    console.log('прибавил 1 игроку');
  }
  winModal(playerWinsScore);
}

function counterLose(isEnemyWin) {
  const enemyWinsScore = document.getElementById('enemyWinsScore');
  const enemyCounter = parseInt(enemyWinsScore.textContent);

  if (isEnemyWin && enemyCounter < 3) {
    enemyWinsScore.textContent = '';
    console.log('Обнулил строку');
    enemyWinsScore.textContent = enemyCounter + 1;
    console.log('прибавил 1 компу');
  }
  loseModal(enemyWinsScore);
}

// Функция для определения победителя и обновления счетчиков
function winnerSelection(player, computer) {
  let win = false;
  let lose = false;
  let draw = false;

  if (
    (player === 'rockBlue' && computer === 'scissorsRed') ||
    (player === 'scissorsBlue' && computer === 'paperRed') ||
    (player === 'paperBlue' && computer === 'rockRed')
  ) {
    win = true;
    console.log("player win!");
  } else if (
    (player === 'rockBlue' && computer === 'rockRed') ||
    (player === 'scissorsBlue' && computer === 'scissorsRed') ||
    (player === 'paperBlue' && computer === 'paperRed')
  ) {
    draw = true;
    console.log("it's draw");
  } else if (
    (player === 'rockBlue' && computer === 'paperRed') ||
    (player === 'scissorsBlue' && computer === 'rockRed') ||
    (player === 'paperBlue' && computer === 'scissorsRed')
  ) {
    lose = true;
    console.log("player lose");
  }

  if (win) {
    counterWin(true);
    start.value = 'You win!';

  } else if (lose) {
    counterLose(true);
    start.value = 'Try again!';

  } else if (draw) {
    start.value = 'Draw!';
  }
}

//___________________________________________

// Функции для отображения финальной модалки

//Победа 
const final = document.getElementById('final');

function winModal(playerWinsScore) {

const winBlue = '../RSP/img/finalWin.svg';

  if(playerWinsScore.textContent === '3') {

    final.style.display='block';
    final.style.backgroundImage = `url('${winBlue}')`;

  } 
  final.addEventListener('click', winFinalClick);
}

// Победа / Обнуление счетчиков и новая игра
function winFinalClick() {
  const currentBankScore = parseInt(bankScoreElement.textContent, 10);
  const currentScoreCount = parseInt(scoreCountElement.textContent, 10);

  // 1) Сумма текущего значения переменной bankScore со значением scoreCount
  const newScoreCount = currentBankScore + currentScoreCount;

  // 2) Обнуление значения счетчиков
  bankScoreElement.textContent = '0';

  playerWinsScore.textContent = '0';

  enemyWinsScore.textContent = '0';

  // 3) Вернуть final первоначальное свойство display:none
  final.style.display = 'none';

  // 4) Обновление значения очков игрока
  scoreCountElement.textContent = newScoreCount.toString();
}


// Поражение
function loseModal(enemyWinsScore) {

const winRed = '../RSP/img/finalRed.svg';

  if(enemyWinsScore.textContent === '3') {

  final.style.display='block';
  final.style.backgroundImage = `url('${winRed}')`;
  }
  final.addEventListener('click', loseFinalClick);
}

// Поражение / Обнуление счетчиков и новая игра
function loseFinalClick() {

  // 1) Обнуление значения счетчиков
  bankScoreElement.textContent = '0';

  playerWinsScore.textContent = '0';

  enemyWinsScore.textContent = '0';

  // 2) Вернуть final первоначальное свойство display:none
  final.style.display = 'none';

}

// Конец игры
function scoreGameOver(scoreCountElement) {

const gameOver = '../RSP/img/gameOver.svg';

  if(scoreCountElement.textContent === '0') {

  final.style.display='block';
  final.style.backgroundImage = `url('${gameOver}')`;

  final.addEventListener('click', function() {
      window.location.reload();
    });
  }
}
