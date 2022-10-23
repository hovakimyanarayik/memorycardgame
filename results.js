import { getUsernameFromLocalStorage, getLocalId, getTokenFromLocalStorage } from "./utility.js"

const apiKey = 'AIzaSyBsRHNWmn0A5NZRUGHLe3uFTb7bEzfWQnk';


export function renderTopPlayersComponent(topPlayers) {
    return topPlayers.map(player => {
        return `
            <li>
                <p>${player.username}</p>
                <div class="top-player-results">
                    <p>Moves: ${player.moves}</p>
                    <p>Time: ${player.minutes} minutes ${player.seconds}sec.</p>
                </div>
            </li>
        `
    }).join('')
}

export function sendResultToServer(moves, seconds, minutes) {
    if(!getLocalId() || !getUsernameFromLocalStorage()) return;

    const userResult = {
        username: getUsernameFromLocalStorage(),
        localId: getLocalId(),
        moves,
        seconds,
        minutes
    }

    return fetch(`https://mymemorycardgame-default-rtdb.firebaseio.com/results.json?auth=${getTokenFromLocalStorage()}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userResult)
    })
    .then(response => response.json())
    
}

function compareMoves(res1, res2) {
    if(res1.minutes > 0 ) {
        res1.seconds = res1.seconds + res1.minutes * 60
    }
    if(res2.minutes > 0 ) {
        res2.seconds = res2.seconds + res2.minutes * 60
    }

    return +res1.moves - +res2.moves;
}

function findTop3Players(playerResults) {
    
    return playerResults.sort(compareMoves).slice(0, 3)
}


function getUsersResults() {
    return fetch (`https://mymemorycardgame-default-rtdb.firebaseio.com/results.json?key=${apiKey}`)
        .then(response => response.json())
}

export function getTopPlayers() {
    return getUsersResults()
        .then(response => {
            if(response.error) return [];
            return findTop3Players(Object.values(response))
        })
}



export function getUserIndividualResults(localId) {
    return getUsersResults()
    .then(response => {
        if(response.error) return [];
        return Object.values(response).filter(result => result.localId == localId)
    })
}



export function getUserRecord(localId) {
    return getUserIndividualResults(localId)
    .then(response => {
        return response.sort(compareMoves)[0]
    })
}


export function userRecordSection (record) {
    if(record == undefined) {
        return `
            <div class="user-results-contain">
                <h2> <span class="username" id="username">${getUsernameFromLocalStorage()}</span> Individual Record</h2>
                <p>You don't have any games played yet</p>
            </div>
        `
    }
    return `
        <div class="user-results-contain">
            <h2> <span class="username" id="username">${record.username}</span> Individual Record</h2>
            <ul class="user-results">
                <li>
                    <p>Moves: ${record.moves}</p>
                    <p>Time: ${record.minutes} minutes ${record.seconds}sec.</p>
                </li>
            </ul>
        </div>
    `
}



