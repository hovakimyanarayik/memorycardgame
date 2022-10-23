export function getImagesByCategorie(categorie) {
    const apiKey = '563492ad6f91700001000001a5a77f143864499c9f06a62f751445eb';
    const randomPage = Math.floor(Math.random()*9 + 1)

    return fetch(`https://api.pexels.com/v1/search?query=${categorie}&page=${randomPage}&per_page=8`, {
            headers: {
                Authorization: apiKey,
            }
        })
        .then(response => response.json())
}



export function getPairedImages(images) {
    return images.reduce((img, i) => img.concat(i, i), []);
  };


export function shuffleCards(cards) {
    cards.forEach(card => {
        card.style.order = Math.floor(Math.random() * cards.length).toString();
    });
}




// -------------------------------

export function flipCard(card) {
    card.parentElement.classList.add('open');
}


export function checkMatching(card1, card2) {
    return card1.dataset.id === card2.dataset.id
}


export function backFlipCards(card1, card2) {
    setTimeout(() => {
       card1.parentElement.classList.remove('open');
        card2.parentElement.classList.remove('open'); 
    }, 1000)
    
}



export function checkAllCards(cards) {
    return cards.every(card => card.classList.contains('open'))
}


export function resetMovesCounter() {
    document.getElementById('moves-count').textContent = 0;
}

function winMessage(time, moves) {
    const minutes = time.split(':')[0]
    const seconds = time.split(':')[1].slice(1)
    return `
        <p>Your result: ${moves} moves for ${minutes == '00 ' ? '0' : '00'} minutes and ${seconds} seconds</p>
        <button class="button closeBtn">Close</button>
    `
}

function destroyModal() {
    if(document.querySelector('.modalOverlay')) document.querySelector('.modalOverlay').remove();
}

function createModal(title, content) {
    destroyModal();
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modalOverlay');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    setTimeout(() => {
        modal.classList.add('opened')
    }, 40)
    modalOverlay.appendChild(modal);
    const header = document.createElement('h1');
    header.innerHTML = title
    modal.appendChild(header)
    modal.innerHTML += content;
    
    modalOverlay.addEventListener('click', (e) => {
        if(e.target.classList.contains('closeBtn') || e.target.classList.contains('modalOverlay')) {
            document.querySelector('.modalOverlay').remove()
        }
    })
    document.body.appendChild(modalOverlay)
}


function getResultMessage(seconds, minutes , movesCount) {
    return `<p>Your result: ${movesCount} moves for ${minutes} minutes and ${seconds} seconds.</p>`
}


export function showWinModal(movesCount, seconds, minutes) {
    createModal('You Win', getResultMessage(seconds, minutes , movesCount))
}

function createSignForm(type) {
    return `
        <form id="signForm">
            <div>
                ${type === 'signUp' ? `<input type="text" name="username" placeholder="Username" maxlength="12" minlength="3" required>` : ''}
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required minlength="6">
            </div>
            <button class="button"${type === 'signUp' ? 'data-action="signUp" > Sign Up' : 'data-action="signIn" > Sign In'}</button>
            ${type === 'signUp' ?
                '<p class="clickable" data-action="toSignIn">Already have an account?</p>' 
                : 
                '<p class="clickable" data-action="toSignUp">Create an account</p>'
        }
        </form>
    `
}

export function showSignModal(type) {
    if(type === 'signUp') {
        createModal('Sign Up', createSignForm('signUp'))
    } else {
        createModal('Sign In', createSignForm('signIn'))
    }
    
} 

export function tokenAndlocalIdToLocalStorage(token, localId) {
    localStorage.setItem('token', token);
    localStorage.setItem('localId', localId);
}


export function clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('localId');
    localStorage.removeItem('username')
}

export function getLocalId() {
    return localStorage.getItem('localId')
}

export function getTokenFromLocalStorage() {
    return localStorage.getItem('token')
}

export function succesfullSignedModal(type) {
    if(type === 'signUp') {
        createModal('Sign Up', '<p>Succesfully logined in</p>')
    } else {
        createModal('Sign In', '<p>Succesfully logined in</p>')
    }
    
}


export function signUpErrorMessage(message) {
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error')
    errorMessage.textContent = `${message}`;
    document.querySelector('.modal > form > div').appendChild(errorMessage);
    document.querySelector('.modal > form > button').disabled = true;
    setTimeout(() => {
        errorMessage.remove()
        if(document.querySelector('.modal > form > button')) document.querySelector('.modal > form > button').disabled = false;
    }, 2500)
}



export function resetPasswordInput() {
    document.querySelector('input[type="password"]').value = '';
}

export function resetEmailInput() {
    document.querySelector('input[type="email"]').value = '';
}


export function usernameToLocalStorage(username) {
    localStorage.setItem('username', username)
}


export function getUsernameFromLocalStorage() {
    return localStorage.getItem('username')
}


export function createUserResultsModal(username, results) {
    let content;
    if(results.length === 0) {
        content = "<p>You don't have results yet.</p>"
    } else {
        content = `
            <ul class="user-results-list"> 
                ${results.map((result, idx) => `
                <li>
                    ${idx + 1})  ${result.moves} moves for ${result.minutes} and ${result.seconds} seconds.
                </li>
                `).join('')}
            </ul>
            `
    }

    
    createModal(`Your Results`, content)
}