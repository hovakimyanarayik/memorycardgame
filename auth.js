import { getTokenFromLocalStorage } from "./utility.js";

const apiKey = 'AIzaSyBsRHNWmn0A5NZRUGHLe3uFTb7bEzfWQnk';


export function signUpByEmailAndPassword(email, password) {
    
    const authProps = {
        email,
        password,
        returnSecureToken: true
    }

    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(authProps)
    })
    .then(response => response.json())
    
}



export function createUser(username, email, localId) {
    const user = {
        username,
        email,
        localId
    }

    return fetch(`https://mymemorycardgame-default-rtdb.firebaseio.com/users.json?auth=${getTokenFromLocalStorage()}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
}



export function signInByEmailAndPassword(email, password) {
    const user = {
        email,
        password,
        returnSecureToken: true
    }

    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
}

function findUserByLocalId(response, localId) {
    return Object.values(response).find(user => user.localId == localId)
}

export function getUserByLocalId(localid) {
    if(!getTokenFromLocalStorage()) return 'signOuted';
    return fetch(`https://mymemorycardgame-default-rtdb.firebaseio.com/users.json?auth=${getTokenFromLocalStorage()}`)
        .then(response => response.json())
        .then(response => {
            if(response.error) return 'rejected';
            
            return findUserByLocalId(response, localid);
        })
}