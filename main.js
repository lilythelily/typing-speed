"use strict";

// === start control ===

const startBtn = document.querySelector(".start-btn");
const typingContainer = document.querySelector(".typing-text");
const btnText = document.querySelector(".btn-text");
const passageBtn = document.querySelector(".chip-passage");
const dropdownSelect = document.querySelector("#timed-select");
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

startBtn.addEventListener("click", ready);
passageBtn.addEventListener("click", ready);
dropdownSelect.addEventListener("change", ready);

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
    typingContainer.innerHTML = easyText;

    const mediumText = data.medium[`${randomNumber}`].text;
    const hardText = data.hard[`${randomNumber}`].text;
  } catch (error) {
    console.error("Error:", error);
    toggleHide(errorModal);
  }
}

// === error modal ===
const errorModal = document.querySelector(".error-modal");
const errorClose = document.querySelector(".error-close");
errorClose.addEventListener("click", () => {
  errorModal.classList.add('hide');
});

fetchData();


// 🔧 START FROM HERE ====
//  === compare sample vs input text===

const inputContainer = document.querySelector(".input-container");

inputContainer.addEventListener("input", () => {
  const sampleArray = typingContainer.textContent.split("");
  const inputArray = inputContainer.textContent.split("");
  // let spanInput = sampleArray
  //   .map((char, index) => {
  //     if (inputArray[index] !== char) {
  //       return `<span class='red-text'>${inputArray[index]}</span>`;
  //     } else {
  //       return `<span class='green-text'>${inputArray[index]}</span>`;
  //     }
  //   })
  //   .join("");

  inputArray.map((char, index) => {
    if (sampleArray[index] !== char) {
      inputArray[2].classList.add("error-text");
    } else {
      return `<span class='success-text'>${char}</span>`;
    }
  });
});
