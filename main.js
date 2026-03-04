"use strict";
const startBtn = document.querySelector(".start-btn");
const sectionMenu = document.querySelector(".section__menu-container");
const chipBtn = document.querySelectorAll(".difficulty");
const [easy, medium, hard] = chipBtn;
// const dropdownMenu = document.querySelector(".dropdown-menu");
// const dropOptions = document.querySelectorAll(".drop-option");
// const [optionEasy, optionMedium, optionHard] = dropOptions;
// const difficultyDropdown = document.querySelector("#difficulty-select");
// const difficultyOption = document.querySelector(".difficultyDropdown");
// const timingDropdown = document.querySelector("#timing-dropdown");
// let dropdownValue = timingDropdown.value;
const typingContainer = document.querySelector(".typing-text");
const inputContainer = document.querySelector(".input-container");
const btnText = document.querySelector(".btn-text");
const hr = document.querySelector("hr");
const btns = document.querySelector(".btns");
const restartBtn = document.querySelector(".restart-btn");
const accuracyScore = document.querySelector(".accuracy-score");
const resultsH1 = document.querySelector("h1");
const resultsH2 = document.querySelector("h2");
const resultsWpm = document.querySelector(".card-wpm-score");
const resultsAccuracy = document.querySelector(".card-accuracy-score");
const resultsChar = document.querySelector(".card-characters-score");
const againBtn = document.querySelector(".variable-btn");
const pb = document.querySelector(".score-wpm");
const checkCircle = document.querySelector(".check-circle");
const highScoreMark = document.querySelector(".high-score-mark");
let savedPersonalBest = "";
const wpmText = document.querySelector(".wpm-score");
let typingStartTime = null;
const clearStorageBtn = document.querySelector("#clear-storage");

const titleDifficulty = document.querySelector('#title-difficulty');
const menuDifficulty = document.querySelector('#difficulty-menu');
const titleTime = document.querySelector("#title-time");
const menuTime = document.querySelector("#time-menu");

// === fetch JSON data ===

async function fetchData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();

    // function getRandom() {
    //   return Math.floor(Math.random() * 11);
    // }

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
    removeHide(errorModal);
  }
}

// === error modal ===
const errorModal = document.querySelector(".error-modal");
const errorClose = document.querySelector(".error-close");
errorClose.addEventListener("click", () => {
  addHide(errorModal);
});

fetchData();

// === select difficulty ===

function selected(chip) {
  chip.classList.add("selected");
}
function unselected(chip) {
  chip.classList.remove("selected");
}

// function clearAll() {
//   unselected(easy);
//   unselected(medium);
//   unselected(hard);

// }

function selectUnselect(item1, item2, item3) {
  selected(item1);
  unselected(item2);
  unselected(item3);
}

chipBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target == easy) {
      selectUnselect(easy, medium, hard);
    } else if (e.target == medium) {
      selectUnselect(medium, easy, hard);
    } else if (e.target == hard) {
      selectUnselect(hard, easy, medium);
}
  });
});

// === mobile dropdown selection ===

function opacity1(item) {
  item.style.opacity = 1;
}
function opacity0(item) {
  item.style.opacity = 0;
}

titleDifficulty.addEventListener('click', () => {
  opacity1(menuDifficulty);
})

titleTime.addEventListener("click", () => {
  opacity1(menuTime);
});


menuDifficulty.addEventListener('click', (e) => {
    opacity0(menuDifficulty);
    if (e.target == menuDifficulty.firstElementChild) {
      titleDifficulty.innerHTML = "Easy";
    } else if (e.target == menuDifficulty.lastElementChild) {
      titleDifficulty.innerHTML = "Hard";
    } else {
      titleDifficulty.innerHTML = "Medium"
}
})
  
menuTime.addEventListener('click', (e) => {
  opacity0(menuTime);
  if (e.target == menuTime.firstElementChild) {
    titleTime.innerHTML = "Timed (60s)";
  } else if (e.target == menuTime.lastElementChild){
    titleTime.innerHTML = "Passage";
  }
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


// === style control ===

function toggleDisplay(item) {
  item.classList.toggle("hide");
  item.classList.toggle("flex");
}

function removeFlex(item) {
  item.classList.remove("flex");
  item.classList.add("hide");
}

function addFlex(item) {
  item.classList.remove("hide");
  item.classList.add("flex");
}

function removeHide(item) {
  item.classList.remove("hide");
}

function addHide(item) {
  item.classList.add("hide");
}

function ready() {
  typingContainer.classList.remove("blur-text");
  toggleDisplay(btnText);
  toggleDisplay(btns);
  removeHide(hr);
  // fetchData();
  defaultTime();
  // clearAll();
  // clearTimeSelection();
  // defaultMobileOptions();
}

function clearInput() {
  inputContainer.value = "";
}

function clearWpm() {
  wpmText.innerHTML = "0";
}

function clearAccuracy() {
  accuracyScore.innerHTML = "100%";
  accuracyScore.classList.remove("span-red");
}

function clearResults() {
  resultsAccuracy.innerHTML = "";
  resultsWpm.innerHTML = "";
  resultsChar.innerHTML = "";
}

// === start the test ===

startBtn.addEventListener("click", ready);

//  === accuracy check & results===
const resultsBtn = document.querySelector("#results-btn");
const complete = document.querySelector(".section__complete");
const typingSection = document.querySelector(".section__typing");

let totalCorrect = 0;
let firstTime = true;

inputContainer.addEventListener("input", () => {
  resultsAccuracy.innerHTML = "";
  resultsWpm.innerHTML = "";
  resultsChar.innerHTML = "";

  const sampleArray = typingContainer.textContent.split("");
  const inputArray = inputContainer.value.split("");
  let checkedFlags = new Array(sampleArray.length).fill(false);
  let cursorAdded = false;
  let testInput = sampleArray
    .map((char, index) => {
      if (inputArray[index] === undefined && !cursorAdded) {
        cursorAdded = true;
        return `<span class="default-text text-cursor">${char}</span>`;
      } else if (char === inputArray[index] && !checkedFlags[index]) {
        checkedFlags[index] = true;

        return `<span class="success-text">${char}</span>`;
      } else if (
        char !== inputArray[index] &&
        !checkedFlags[index] &&
        inputArray[index] !== undefined
      ) {
        checkedFlags[index] = true;

        return `<span class="error-text">${char}</span>`;
      } else if (inputArray[index] === undefined) {
        return `<span class="default-text">${char}</span>`;
      } else if (checkedFlags[index]) {
        return `<span class="default-text">${char}</span>`;
      }
    })
    .join("");

  if (!cursorAdded) {
    testInput += `<span class="text-cursor"></span>`;
  }

  const totalCorrect = sampleArray.reduce((acc, curr, index) => {
    if (curr === inputArray[index]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalTyped = inputArray.length;
  typingContainer.innerHTML = testInput;

  // === accuracy percentage ===

  const accuracyPercentage =
    totalTyped > 0 ? Math.floor((totalCorrect / totalTyped) * 100) : 0;

  if (accuracyPercentage < 100) {
    accuracyScore.classList.add("span-red");
  } else if (accuracyPercentage == 100) {
    accuracyScore.classList.remove("span-red");
  }

  accuracyScore.innerHTML = `${accuracyPercentage}%`;

  if (!typingStartTime) {
    typingStartTime = Date.now();
  }

  // === wpm ===
  const wordArray = inputContainer.value.split(/\s+/);
  const wordCount = wordArray.length;
  const timeElapsed = (Date.now() - typingStartTime) / 60000;
  const wpmResult = Math.floor(wordCount / timeElapsed);

  if (timeElapsed > 0) {
    wpmText.innerHTML = `${wpmResult}`;
  } else {
    wpmText.innerHTML = "0";
  }

  // // === display results ===

  resultsBtn.addEventListener("click", () => {
    handlePb();
    if (firstTime) {
      firstTime = false;
      resultsH1.innerHTML = "Baseline Established!";
      resultsH2.innerHTML =
        "You've set the bar. Now the real challenge begins-time to beat it.";
      againBtn.innerHTML = `Go Again
          <img src="./assets/images/icon-restart-gray.svg" alt="restart" />`;
      addHide(highScoreMark);
      removeHide(checkCircle);
    }
    addHide(typingSection);
    removeFlex(btns);
    removeHide(complete);
    addHide(hr);
    addHide(sectionMenu);
    addHide(difficultyDropdown);
    addHide(timingDropdown);

    resultsAccuracy.innerHTML = `${accuracyPercentage}%`;
    resultsChar.innerHTML = `
              ${totalCorrect}<span class="span-gray"> /</span
              ><span class="span-red" id="card-wrong-char">${
                totalTyped - totalCorrect
              }</span>
    `;
  });
});

// === restart button control ===
restartBtn.addEventListener("click", () => {
  clearInput();
  fetchData();
  clearTimer();
  clearAccuracy();
  clearWpm();
  // clearAll();
});

againBtn.addEventListener("click", () => {
  removeHide(typingSection);
  toggleDisplay(btns);
  clearInput();
  fetchData();
  clearTimer();
  clearAccuracy();
  clearWpm();
  defaultTime();
  removeHide(hr);
  removeHide(sectionMenu);
  addHide(complete);
  totalCorrect = 0;
  resultsAccuracy.innerHTML = "";
  resultsWpm.innerHTML = "";
  resultsChar.innerHTML = "";
  inputContainer.value = "";
  typingStartTime = Date.now();
  removeHide(difficultyDropdown);
  removeHide(timingDropdown);
  // clearAll();
  // clearTimeSelection();
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
  timeDisplay.classList.remove("yellow-text");

}

// function clearTimeSelection() {
//   unselected(timed);
//   unselected(passage);
//   dropdownValue = "";
//   console.log(dropdownValue);
// }


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
  resultsBtn.addEventListener("click", () => {
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
  resultsBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    stoppedPassage = true;
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

// === personal best count ===

function handlePb() {
  const wordArray = inputContainer.value.split(/\s+/);
  const wordCount = wordArray.length;
  const timeElapsed = (Date.now() - typingStartTime) / 60000;
  const wpmResult = Math.round(wordCount / timeElapsed);
  if (timeElapsed > 0) {
    wpmText.innerHTML = `${wpmResult}`;
  } else {
    wpmText.innerHTML = "0";
  }

  const pbKey = "personalBest";
  savedPersonalBest = parseInt(localStorage.getItem(pbKey), 10) || 0;
  resultsWpm.innerHTML = `${wpmResult}`;

  if (wpmResult > savedPersonalBest && firstTime) {
    savedPersonalBest = wpmResult;
    localStorage.setItem(pbKey, savedPersonalBest);
    resultsH1.innerHTML = "High Score Smashed!";
    resultsH2.innerHTML = "You're getting faster. That was incredible typing.";
    againBtn.innerHTML = `Beat This Score
          <img src="./assets/images/icon-restart-gray.svg" alt="restart" />`;
    addHide(checkCircle);
    removeHide(highScoreMark);
  } else if (wpmResult <= savedPersonalBest && firstTime) {
    resultsH1.innerHTML = "Test Complete!";
    resultsH2.innerHTML = "Solid run. Keep pushing to beat your high score.";
    againBtn.innerHTML = `Go Again
          <img src="./assets/images/icon-restart-gray.svg" alt="restart" />`;
    removeHide(checkCircle);
    addHide(highScoreMark);
  }

  pb.innerHTML = `${savedPersonalBest} WPM`;
}

// === clear local storage ===

clearStorageBtn.addEventListener("click", () => {
  localStorage.clear();
});

// === display personal data on page load ===
document.addEventListener("DOMContentLoaded", () => {
  const pbKey = "personalBest";
  const savedPersonalBest = parseInt(localStorage.getItem(pbKey), 10) || 0;
  pb.innerHTML = `${savedPersonalBest} WPM`;
});
