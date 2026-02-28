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
const btnText = document.querySelector(".btn-text");
const hr = document.querySelector("hr");
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
  toggleDisplay(restartBtn);
  toggleHide(hr);
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
    const randomNumber = Math.floor(Math.random() * 11);
    const easyText = data.easy[`${randomNumber}`].text;
    const mediumText = data.medium[`${randomNumber}`].text;
    const hardText = data.hard[`${randomNumber}`].text;

    function content() {
      if (easy.classList.contains("selected")) {
        typingContainer.innerHTML = easyText;
      } else if (medium.classList.contains("selected")) {
        typingContainer.innerHTML = mediumText;
      } else if (hard.classList.contains("selected")) {
        typingContainer.innerHTML = hardText;
      } else {
        typingContainer.innerHTML = easyText;
      }
    }
    content();
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

const inputContainer = document.querySelector(".input-container");

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
