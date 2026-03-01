"use strict";

// === select difficulty ===

const chipBtn = document.querySelectorAll(".difficulty");
const [easy, medium, hard] = chipBtn;

function selected(chip) {
  chip.classList.add("selected");
}
function unselected(chip) {
  chip.classList.remove("selected");
}
chipBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target == easy) {
      selected(easy);
      unselected(medium);
      unselected(hard);
    } else if (e.target == medium) {
      selected(medium);
      unselected(easy);
      unselected(hard);
    } else {
      selected(hard);
      unselected(easy);
      unselected(medium);
    }
  });
});

// === select mode ===
const modeBtn = document.querySelectorAll(".mode");
const [timed, passage] = modeBtn;

modeBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target == timed) {
      selected(timed);
      unselected(passage);
    } else {
      selected(passage);
      unselected(timed);
    }
  });
});

// === start control ===

const startBtn = document.querySelector(".start-btn");
const typingContainer = document.querySelector(".typing-text");
const inputContainer = document.querySelector(".input-container");
const btnText = document.querySelector(".btn-text");
const hr = document.querySelector("hr");
const btns = document.querySelector(".btns");
const restartBtn = document.querySelector(".restart-btn");

function toggleDisplay(item) {
  item.classList.toggle("hide");
  item.classList.toggle("flex");
}

function toggleHide(item) {
  item.classList.remove("hide");
}

function ready() {
  typingContainer.classList.remove("blur-text");
  toggleDisplay(btnText);
  toggleDisplay(btns);
  toggleHide(hr);
  fetchData();
}

function clearInput() {
  inputContainer.value = "";
}

btnText.addEventListener("click", ready);

// === fetch JSON data ===

async function fetchData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();

    function getRandom() {
      return Math.floor(Math.random() * 11);
    }

    let randomNumber = Math.floor(Math.random() * 11);

    // --- populate text in accordance with the level ---
    const easyText = data.easy[`${randomNumber}`].text;
    const mediumText = data.medium[`${randomNumber}`].text;
    const hardText = data.hard[`${randomNumber}`].text;

    if (easy.classList.contains("selected")) {
      typingContainer.innerHTML = easyText;
    } else if (medium.classList.contains("selected")) {
      typingContainer.innerHTML = mediumText;
    } else if (hard.classList.contains("selected")) {
      typingContainer.innerHTML = hardText;
    } else {
      typingContainer.innerHTML = easyText;
    }
  } catch (error) {
    console.error("Error:", error);
    toggleHide(errorModal);
  }
}

// === error modal ===
const errorModal = document.querySelector(".error-modal");
const errorClose = document.querySelector(".error-close");
errorClose.addEventListener("click", () => {
  errorModal.classList.add("hide");
});

fetchData();

//  === compare sample vs input text===

inputContainer.addEventListener("input", () => {
  const sampleArray = typingContainer.textContent.split("");
  const inputArray = inputContainer.value.split("");

  let cursorAdded = false;

  let testInput = sampleArray
    .map((char, index) => {
      if (inputArray[index] === undefined && !cursorAdded) {
        cursorAdded = true;
        return `<span class="default-text text-cursor">${char}</span>`;
      } else if (char == inputArray[index]) {
        return `<span class="success-text">${char}</span>`;
      } else if (inputArray[index] === undefined) {
        return `<span class="default-text">${char}</span>`;
      } else {
        return `<span class="error-text">${char}</span>`;
      }
    })
    .join("");

  if (!cursorAdded) {
    testInput + -`<span class="text-cursor"></span>`;
  }

  typingContainer.innerHTML = testInput;
});

// === restart button control ===
restartBtn.addEventListener("click", () => {
  clearInput();
  fetchData();
  clearTimer();
  defaultTime();
});

// === timer control ===

let timerInterval;
let start;
let remainingTime = 60000;
let stopped = false;

const timeDisplay = document.querySelector(".time-count");
const stopBtn = document.querySelector(".stop-timer");

// --- change display color of the timer ---
function timeColor() {
  timeDisplay.classList.add("yellow-text");
}

// --- clear timer ---
function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// --- revert timer display to default ---

function defaultTime() {
  if (timed.classList.contains("selected")) {
    timeDisplay.innerHTML = "0:60";
  } else if (passage.classList.contains("selected")) {
    timeDisplay.innerHTML = "0:00";
  }
}

// --- time formatting ---

function timeFormat(min, sec) {
  if (sec < 10) {
    timeDisplay.innerHTML = `${min}:0${sec}`;
  } else {
    timeDisplay.innerHTML = `${min}:${sec}`;
  }
}

// --- timed mode ---

function timedCount() {
  clearTimer();
  const timeLimit = stopped ? remainingTime : 60000;
  start = Date.now();
  stopped = false;
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const remaining = timeLimit - elapsed;
    if (remaining <= 0) {
      clearTimer();
      timeDisplay.innerHTML = "0:00";
    } else {
      remainingTime = remaining;
      const totalSeconds = Math.floor(remaining / 1000);
      const min = Math.floor(totalSeconds / 60);
      const sec = totalSeconds % 60;
      timeFormat(min, sec);
    }
  }, 1000);
  // === stop the timer ===
  stopBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    stopped = true;
  });
}

// --- passage mode ---

let elapsedTime = 0;
let stoppedPassage = false;

function passageCount() {
  clearTimer();
  start = Date.now();
  timerInterval = setInterval(() => {
    if (!stoppedPassage) {
      const currentElapsed = Date.now() - start;
      const totalElapsed = elapsedTime + currentElapsed;
      const totalSeconds = Math.floor(totalElapsed / 1000);
      const min = Math.floor(totalSeconds / 60);
      const sec = Math.floor(totalSeconds % 60);
      timeFormat(min, sec);
    }
  }, 1000);
  // === stop the timer ===
  stopBtn.addEventListener("click", () => {
    if (!stoppedPassage) {
      clearInterval(timerInterval);
      elapsedTime += Date.now() - start;
      stoppedPassage = true;
    }
  });
}

// === timer starts by typing a text ===
inputContainer.addEventListener("click", () => {
  timeColor();
  if (timed.classList.contains("selected")) {
    timedCount();
  } else if (passage.classList.contains("selected")) {
    passageCount();
  }
});

// === resume typing ===
inputContainer.addEventListener("click", () => {
  if (stopped) {
    stopped = false;
    start = Date.now;
    timedCount();
  } else if (stoppedPassage) {
    stoppedPassage = false;
    start = Date.now;
    passageCount();
  }
});

// === wpm count ===

const wpmText = document.querySelector(".wpm-score");
let typingStartTime = null;

function wpm() {
  if (!typingStartTime) {
    wpmText.innerHTML = "0";
    return;
  }
  const wordArray = inputContainer.value.split(/\s+/);
  const wordCount = wordArray.length;
  const timeElapsed = (Date.now() - typingStartTime) / 60000;

  if (timeElapsed > 0) {
    const wpmResult = Math.round(wordCount / timeElapsed);
    wpmText.innerHTML = `${wpmResult}`;
  } else {
    wpmText.innerHTML = "0";
  }
}

inputContainer.addEventListener("input", () => {
  wpm();
  if (!typingStartTime) {
    typingStartTime = Date.now();
  }
});

// === accuracy check ===

const accuracyScore = document.querySelector(".accuracy-score");

let correctChar = 0;
let mistake = 0;

function accuracy() {
  correctChar = 0;
  mistake = 0;

  const sampleArray = typingContainer.textContent.split("");
  const inputArray = inputContainer.value.split("");

  sampleArray.map((char, index) => {
    if (char == inputArray[index]) {
      correctChar++;
    } else if (inputArray[index] !== undefined) {
      mistake++;
    }
  });

  const totalTyped = correctChar + mistake;

  const accuracyPercentage =
    totalTyped > 0 ? Math.round((correctChar / totalTyped) * 100) : 0;

  if (accuracyPercentage < 100) {
    accuracyScore.classList.add("span-red");
  } else if (accuracyPercentage == 100) {
    accuracyScore.classList.remove("span-red");
    accuracyScore.classList.add("success-text");
  }

  accuracyScore.innerHTML = `${accuracyPercentage}%`;
}

inputContainer.addEventListener("keydown", (e) => {
  if (e.key != "Backspace") {
    accuracy();
  } 
});
