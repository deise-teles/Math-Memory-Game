let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let timerInterval;
let matches = 0;
const totalPairs = 8;

function startGame() {
  const difficulty = document.getElementById("difficulty").value;
  const board = document.getElementById("memory-board");
  board.innerHTML = "";
  moves = 0;
  timer = 0;
  matches = 0;
  document.getElementById("moves").textContent = "Movimentos: 0";
  document.getElementById("timer").textContent = "Tempo: 0s";
  document.getElementById("endMessage").classList.add("hidden");
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = "Tempo: " + timer + "s";
  }, 1000);

  const cards = generateCards(difficulty);
  shuffle(cards);
  cards.forEach(({ id, value, display }) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.id = id;
    div.dataset.value = value;
    div.textContent = display;
    div.addEventListener("click", handleCardClick);
    board.appendChild(div);
  });
}

function generateCards(difficulty) {
  let operations = [];
  if (difficulty === "easy") {
    operations = [
      ["2+2", "4"], ["3+5", "8"], ["1+6", "7"], ["4+3", "7"],
      ["2+5", "7"], ["6+1", "7"], ["5+2", "7"], ["3+4", "7"]
    ];
  } else if (difficulty === "medium") {
    operations = [
      ["5*2", "10"], ["6-3", "3"], ["8/2", "4"], ["9+1", "10"],
      ["12-4", "8"], ["3*3", "9"], ["15/3", "5"], ["7+2", "9"]
    ];
  } else {
    operations = [
      ["7*6", "42"], ["81/9", "9"], ["9*5", "45"], ["14+21", "35"],
      ["12*3", "36"], ["100/4", "25"], ["48/6", "8"], ["9*9", "81"]
    ];
  }

  const selected = operations.slice(0, totalPairs);
  let cards = [];
  selected.forEach(([op, res], index) => {
    const id = op + "=" + res;
    cards.push({ id, value: op, display: op });
    cards.push({ id, value: res, display: res });
  });
  return cards;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleCardClick(e) {
  const card = e.target;
  if (lockBoard || card.classList.contains("revealed") || card.classList.contains("matched")) return;

  card.classList.add("revealed");
  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  document.getElementById("moves").textContent = "Movimentos: " + moves;

  const id1 = firstCard.dataset.id;
  const id2 = secondCard.dataset.id;

  if (id1 === id2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    resetBoard();
    if (matches === totalPairs) endGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("endMessage").classList.remove("hidden");
  document.getElementById("endMessage").innerHTML = `🎉 Parabéns! Você completou o jogo em <strong>${moves}</strong> movimentos e <strong>${timer}</strong> segundos.`;
}
