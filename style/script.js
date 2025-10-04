const board = document.getElementById("puzzle-board");
const piecesContainer = document.getElementById("pieces-container");
const resetBtn = document.getElementById("reset");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const successAnimation = document.getElementById("success-animation");

const imageSrc = "./style/AnhGhep.jpg"; 
const pieceCount = 4;

function startGame() {
  updateProgress();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < pieceCount * pieceCount; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    // cho phép drop
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");

      const pieceId = e.dataTransfer.getData("pieceId");
      const piece = document.getElementById(pieceId);

      if (slot.firstChild) {
        piecesContainer.appendChild(slot.firstChild);
      }
      slot.appendChild(piece);
      updateProgress();
      checkWin();
    });

    board.appendChild(slot);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createPieces() {
  piecesContainer.innerHTML = "";
  const indices = shuffle([...Array(pieceCount * pieceCount).keys()]);
  indices.forEach((i, idx) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.dataset.index = i;
    piece.id = "piece-" + idx;

    const x = i % pieceCount;
    const y = Math.floor(i / pieceCount);
    piece.style.backgroundImage = `url(${imageSrc})`;
    
    const pieceSize = getPieceSize();
    const boardSize = getBoardSize();
    piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;

    // cho phép kéo
    piece.setAttribute("draggable", "true");
    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("pieceId", piece.id);
      piece.classList.add("dragging");
    });
    piece.addEventListener("dragend", () => {
      piece.classList.remove("dragging");
    });

    piecesContainer.appendChild(piece);
  });
}

function getPieceSize() {
  return window.innerWidth <= 360 ? 45 : 
          window.innerWidth <= 480 ? 50 : 
          window.innerWidth <= 768 ? 60 : 70;
}

function getBoardSize() {
  return window.innerWidth <= 360 ? 180 : 
          window.innerWidth <= 480 ? 200 : 
          window.innerWidth <= 768 ? 240 : 280;
}

function updateProgress() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;
  slots.forEach((slot, i) => {
    const piece = slot.firstElementChild;
    if (piece && piece.dataset.index == i) {
      correct++;
    }
  });
  
  const percentage = Math.round((correct / (pieceCount * pieceCount)) * 100);
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}%`;
}

function checkWin() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;
  slots.forEach((slot, i) => {
    const piece = slot.firstElementChild;
    if (piece && piece.dataset.index == i) {
      correct++;
    }
  });

  if (correct === pieceCount * pieceCount) {
    setTimeout(() => {
      showSuccessModal();
    }, 500);
  }
}

function showSuccessModal() {
  successAnimation.classList.add("show");
}

function closeSuccessModal() {
  successAnimation.classList.remove("show");
}

resetBtn.addEventListener("click", () => {
  createBoard();
  createPieces();
  startGame();
});

window.addEventListener("resize", () => {
  createPieces();
});

createBoard();
createPieces();
startGame();
