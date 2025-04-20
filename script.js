const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");

const urlParams = new URLSearchParams(window.location.search);
const selectedLevel = urlParams.get("level") || "1";
console.log("Selected Level:", selectedLevel);

let rotationLimit = 999; // Default for higher levels

// Set limits based on level
if (selectedLevel === "1") {
  rotationLimit = 30;
}

let currentRotations = 0;
const rotationCountEl = document.getElementById("rotation-count");
let size = 3; // or 4 depending on level; you can make this dynamic later
let rotations = [];

function createPuzzle() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const piece = document.createElement("div");
      piece.className = "piece";
      piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

      let initialRotation = 90 * Math.floor(Math.random() * 4);
      let index = row * size + col;
      rotations[index] = initialRotation;

      piece.dataset.index = index;
      piece.dataset.totalRotation = initialRotation;
      piece.style.transform = `rotate(${initialRotation}deg)`;

      piece.addEventListener("click", () => {
        if (currentRotations >= rotationLimit) return;
      
        let idx = parseInt(piece.dataset.index);
        rotations[idx] = (rotations[idx] + 90) % 360;
        piece.dataset.totalRotation = parseInt(piece.dataset.totalRotation) + 90;
        piece.style.transform = `rotate(${piece.dataset.totalRotation}deg)`;
      
        currentRotations++;
        rotationCountEl.textContent = `Rotations: ${currentRotations} / ${rotationLimit}`;
      
        checkIfSolved();
      });

      puzzle.appendChild(piece);
    }
  }
}

function checkIfSolved() {
  const isSolved = rotations.every((angle) => angle % 360 === 0);
  if (isSolved) {
    clearInterval(timerInterval);  // Clear the timer when the puzzle is solved
    message.textContent = "🎉 Congratulations! You solved the puzzle!";
  }
}

function startLevelTimer(minutes) {
  let timeLeft = minutes * 60; // 2 minutes for level 1
  const timerDisplay = document.createElement("p");
  timerDisplay.id = "timer";
  timerDisplay.style.color = "#ff4d4d";
  timerDisplay.style.fontWeight = "bold";
  timerDisplay.style.fontSize = "1.2rem";
  message.after(timerDisplay);

  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `⏳ Time Left: ${mins}:${secs.toString().padStart(2, "0")}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      message.textContent = "⏰ Time's up!";
      // Optionally disable further rotation
      puzzle.querySelectorAll(".piece").forEach(p => p.style.pointerEvents = "none");
    }
    timeLeft--;
  }

  updateTimer(); // call immediately
  timerInterval = setInterval(updateTimer, 1000);
}

// INIT
createPuzzle();
startLevelTimer(2); // Starts the level timer with 2 minutes for level 1
