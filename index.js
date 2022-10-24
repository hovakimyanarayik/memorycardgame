import GameHeaderComponent from "./Components/GameWindowHeaderComponent.js";
import CardComponent from "./Components/CardComponent.js";
// import { signUpByEmailAndPassword, createUser, signInByEmailAndPassword, getUserByLocalId } from './auth.js'
import * as auth from "./auth.js";
import * as results from "./results.js";
import * as u from "./utility.js";
import observeCards from "./observer.js";

const header = document.getElementById("game-window-header"),
  cardsContain = document.getElementById("cards-contain");

let movesCount = 0;
let playeble = false;
let firstCard;
let secondCard;
let timerId;
let seconds = 0;
let minutes = 0;

function renderAllCards(images) {
  cardsContain.innerHTML = "";
  images.forEach((img) => {
    const card = CardComponent.render(img);
    cardsContain.appendChild(card);
  });
  return cardsContain.children;
}

function resetCards() {
  firstCard = undefined;
  secondCard = undefined;
}

function noPlayebleFor1Second() {
  playeble = false;
  setTimeout(() => {
    playeble = true;
  }, 1200);
}

function startTiming() {
  let id = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    document.getElementById("timer").textContent = `0${minutes} : ${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }, 1000);
  return id;
}

function resetTimer(id) {
  clearInterval(id);
  seconds = 0;
  minutes = 0;
  document.getElementById("timer").textContent = "00 : 00";
}

function move() {
  movesCount++;
  document.getElementById("moves-count").textContent = movesCount;
}

function gameEnd() {
  results.sendResultToServer(movesCount, seconds, minutes).then(() => {
    showTopPlayers();
    renderIndividualRecord(u.getLocalId());
  });
  //
  u.showWinModal(movesCount, seconds, minutes);
  resetTimer(timerId);
  u.resetMovesCounter();
  cardsContain.innerHTML = CardComponent.renderEmptyCards();
  setTimeout(() => {
    playeble = false;
  }, 2000);
}

function selectingCard(e) {
  if (
    !playeble ||
    !e.target.classList.contains("back") ||
    e.target.classList.contains("open")
  )
    return;

  if (!firstCard) {
    firstCard = e.target;
    u.flipCard(firstCard);
  } else {
    secondCard = e.target;
    u.flipCard(secondCard);
    move();
    noPlayebleFor1Second();

    if (!u.checkMatching(firstCard, secondCard)) {
      u.backFlipCards(firstCard, secondCard);
    }

    resetCards();

    if (u.checkAllCards([...cardsContain.children])) {
      // win
      gameEnd();
    }
  }
}

function listeningCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", selectingCard);
  });
}

function renderAndStartGame() {
  const imageType = document.querySelector('input[type="radio"]:checked').value;
  u.getImagesByCategorie(imageType).then((data) => {
    playeble = true;
    const cards = [...renderAllCards(u.getPairedImages(data.photos))];
    u.shuffleCards(cards);
    listeningCards(cards);
    timerId = startTiming();
  });
}

function signResponseHandling(response) {
  if (response.error && response.error.message == "EMAIL_EXISTS") {
    // message to email exists
    u.signUpErrorMessage("Email already exists...");
    u.resetEmailInput();
    u.resetPasswordInput();
    return;
  } else if (response.error) {
    // error message
    u.signUpErrorMessage("Please try again...");
    u.resetPasswordInput();
    return;
  }
  u.tokenAndlocalIdToLocalStorage(response.idToken, response.localId);
  u.succesfullSignedModal();
  document.getElementById("startBtn").textContent = "Start";
  return response;
}

function renderIndividualRecord(localId) {
  results.getUserRecord(localId).then((response) => {
    document.getElementById("individual-record-contain").innerHTML =
      results.userRecordSection(response);
    document.getElementById("username").addEventListener("click", () => {
      results.getUserIndividualResults(u.getLocalId()).then((response) => {
        u.createUserResultsModal(localStorage.getItem("username"), response);
      });
    });
  });
}

function renderSignInForm() {
  u.showSignModal("signIn");
  const signInForm = document.getElementById("signForm");

  signInForm.querySelector("p").addEventListener("click", () => {
    renderSignUpForm();
  });

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    auth
      .signInByEmailAndPassword(
        signInForm.email.value,
        signInForm.password.value
      )
      .then((response) => {
        signResponseHandling(response);
        return response;
      })
      .then(() => {
        auth.getUserByLocalId(u.getLocalId()).then((response) => {
          u.usernameToLocalStorage(response.username);
          renderIndividualRecord(response.localId);
        });
      });
  });
}

function renderSignUpForm() {
  u.showSignModal("signUp");
  const signUpForm = document.getElementById("signForm");

  signUpForm.querySelector("p").addEventListener("click", () => {
    renderSignInForm();
  });

  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    auth
      .signUpByEmailAndPassword(
        signUpForm.email.value,
        signUpForm.password.value
      )
      .then((response) => {
        signResponseHandling(response);
        return response;
      })
      .then((response) => {
        if (response.error) return;
        auth
          .createUser(
            signUpForm.username.value,
            response.email,
            response.localId
          )
          .then(() => {
            auth.getUserByLocalId(u.getLocalId()).then((response) => {
              u.usernameToLocalStorage(response.username);
              renderIndividualRecord(response.localId);
            });
          });
      });
  });
}

function startingGame(e) {
  e.preventDefault();
  if (playeble) return;

  if (u.getLocalId()) {
    renderAndStartGame();
  } else {
    renderSignUpForm();
  }
}

function showTopPlayers() {
  results.getTopPlayers().then((response) => {
    document.getElementById("top-players-list").innerHTML =
      results.renderTopPlayersComponent(response);
  });
}

function beforeGame() {
  header.innerHTML = GameHeaderComponent.render();
  GameHeaderComponent.afterRender(startingGame);
  cardsContain.innerHTML = CardComponent.renderEmptyCards();
  u.clearLocalStorage();
  showTopPlayers();
  observeCards();
}

document.addEventListener("DOMContentLoaded", beforeGame);
