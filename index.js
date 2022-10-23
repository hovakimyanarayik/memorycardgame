import GameHeaderComponent from './Components/GameWindowHeaderComponent.js';
import CardComponent from './Components/CardComponent.js';
import { getImagesByCategorie, getPairedImages, shuffleCards, resetMovesCounter, 
    flipCard, checkMatching, backFlipCards, checkAllCards,
    clearLocalStorage, showSignModal, tokenAndlocalIdToLocalStorage, succesfullSignedModal,
    signUpErrorMessage, resetPasswordInput, resetEmailInput, getLocalId, showWinModal,
    usernameToLocalStorage, createUserResultsModal
} from './utility.js';
import { signUpByEmailAndPassword, createUser, signInByEmailAndPassword, getUserByLocalId } from './auth.js'
import { sendResultToServer, getTopPlayers, renderTopPlayersComponent, getUserRecord, userRecordSection, getUserIndividualResults } from './results.js'
import { observeCards } from './observer.js';

const header = document.getElementById('game-window-header'),
    cardsContain = document.getElementById('cards-contain');

let movesCount = 0;
let playeble = false;
let firstCard;
let secondCard;
let timerId;
let seconds = 0;
let minutes = 0;

function renderAllCards(images) {
    cardsContain.innerHTML = '';
    images.forEach(img => {
        const card = CardComponent.render(img);
        cardsContain.appendChild(card);
    })
    return cardsContain.children
}


function resetCards() {
    firstCard = undefined;
    secondCard = undefined;
}

function noPlayebleFor1Second() {
    playeble = false;
    setTimeout(() => {
        playeble = true
    }, 1200)
}

function startTiming() {
    let id = setInterval(() => {
        seconds++;
        if(seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById('timer').textContent = `0${minutes} : ${seconds >= 10 ? seconds : `0${seconds}`}`
    }, 1000)
    return id
}

function resetTimer(id) {
    clearInterval(id)
    seconds = 0;
    minutes = 0;
    document.getElementById('timer').textContent = '00 : 00';
}


function move() {
    movesCount ++;
    document.getElementById('moves-count').textContent = movesCount;
}

function gameEnd() {
    sendResultToServer(movesCount, seconds, minutes)
    .then(() => {
        showTopPlayers()
        renderIndividualRecord(getLocalId())
    })
    // 
    showWinModal(movesCount, seconds, minutes)
    resetTimer(timerId)
    resetMovesCounter()
    cardsContain.innerHTML = CardComponent.renderEmptyCards();
    playeble = false;
    
}


function selectingCard(e) {
    if(!playeble || !e.target.classList.contains('back') || e.target.classList.contains('open')) return;

    if(!firstCard) {
        firstCard = e.target;
        flipCard(firstCard);
    } else {

        secondCard = e.target;
        flipCard(secondCard);
        move();
        noPlayebleFor1Second();

        if(!checkMatching(firstCard, secondCard)) {
            backFlipCards(firstCard, secondCard);
        }

        resetCards();
        
        if(checkAllCards([...cardsContain.children])) {
            // win
            gameEnd()
        }
        

    }
    
}

function listeningCards(cards) {
    cards.forEach(card => {
        card.addEventListener('click', selectingCard)
    })
}


function renderAndStartGame() {
    const imageType = document.querySelector('input[type="radio"]:checked').value
    getImagesByCategorie(imageType)
        .then(data => {
            playeble = true;
            const cards = [...renderAllCards(getPairedImages(data.photos))];
            shuffleCards(cards);
            listeningCards(cards);
            timerId = startTiming();
            
        })
}

function signResponseHandling(response) {
    if(response.error && response.error.message == 'EMAIL_EXISTS') {
        // message to email exists
        signUpErrorMessage('Email already exists...');
        resetEmailInput()
        resetPasswordInput()
        return;
    } else if(response.error) {
        // error message
        signUpErrorMessage('Please try again...');
        resetPasswordInput()
        return;
    }
    tokenAndlocalIdToLocalStorage(response.idToken, response.localId);
    succesfullSignedModal()
    document.getElementById('startBtn').textContent = 'Start'
    return response;

}


function renderIndividualRecord (localId) {
    getUserRecord(localId)
    .then(response => {
        document.getElementById('individual-record-contain').innerHTML = userRecordSection(response)
        document.getElementById('username').addEventListener('click' , (e)=> {
            getUserIndividualResults(getLocalId())
            .then(response => {
                createUserResultsModal(localStorage.getItem('username'), response)
            })

        })
    })
}


function renderSignInForm() {
    showSignModal('signIn');
    const signInForm = document.getElementById('signForm');

    signInForm.querySelector('p').addEventListener('click', () => {
        renderSignUpForm()
    })

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        signInByEmailAndPassword(signInForm.email.value, signInForm.password.value)
        .then(response => {
            signResponseHandling(response)
            return response;
        })
        .then(() => {
            getUserByLocalId(getLocalId())
            .then(response => {
                usernameToLocalStorage(response.username)
                renderIndividualRecord(response.localId)
                
            })
            
        })

    })
}


function renderSignUpForm() {
    showSignModal('signUp');
    const signUpForm = document.getElementById('signForm');

    signUpForm.querySelector('p').addEventListener('click', () => {
        renderSignInForm()
    })

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        signUpByEmailAndPassword(signUpForm.email.value, signUpForm.password.value)
        .then(response => {
            signResponseHandling(response)
            return response
        })
        .then(response => {
            if(response.error) return;
            createUser(signUpForm.username.value, response.email, response.localId)
            .then(() => {
                getUserByLocalId(getLocalId())
                .then(response => {
                    usernameToLocalStorage(response.username)
                    renderIndividualRecord(response.localId)
                })
            })
            
        })
    })
}

function startingGame(e) {
    e.preventDefault();
    if(playeble) return;

    if(getLocalId()) {
        renderAndStartGame()
    } else {
        renderSignUpForm()  
    }
      

}

function showTopPlayers() {
    getTopPlayers()
    .then(response => {
        document.getElementById('top-players-list').innerHTML = renderTopPlayersComponent(response)
    })
}



document.addEventListener('DOMContentLoaded', () => {
    header.innerHTML = GameHeaderComponent.render();
    GameHeaderComponent.afterRender(startingGame);
    cardsContain.innerHTML = CardComponent.renderEmptyCards();
    clearLocalStorage();
    showTopPlayers();
    observeCards()
})