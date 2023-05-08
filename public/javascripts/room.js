const roomPlayer = document.querySelectorAll('.player');
const roomPlayerName = document.querySelectorAll('.player-name');
const roomPlayerImg = document.querySelectorAll('.player-img');
const roomPlayerInfo = document.querySelector('.player-info');
const roomPlayerScore = document.querySelectorAll('.player-score');
const roomButtonLeave = document.querySelector('.button-leave');
const roomBoard = document.querySelector('.room-board');

const colors = ['blue', 'red'];

const socket = io();

if (window.localStorage.getItem('retroGamesUser') === null) {
    redirectTo('/login');
} else {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    
    if (!userInfo.room || !userInfo.room.id) {
        redirectTo();
    } else {
        checkGame(userInfo);
    }
}

function redirectTo(path = '/') {
    window.location.href = path;
}

var canvasList = document.querySelectorAll('.cell canvas');

canvasList.forEach((canvas, index) => {
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (event) => {
        conquerCell(index + 1);
    });
});

function checkGame(userInfo) {
    fetch(`/api/games/${userInfo.room.id}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (!response || (response.status && response.status !== 200)) {
            redirectTo();
        }
        else {
            if (response.status === 200) {
                createGame(userInfo);
            } else {
                updateGame(userInfo);
            }
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function createGame(userInfo) {
    const body = {
        roomId: userInfo.room.id,
        userId: userInfo.id
    };

    fetch('/api/games', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit(`start-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function updateGame(userInfo) {
    const body = {
        roomId: userInfo.room.id,
        userId: userInfo.id
    };

    fetch(`/api/games/${userInfo.room.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit(`start-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

function conquerCell(cellId) {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));

    const body = {
        userId: userInfo.id,
        cellId
    };

    fetch(`/api/games/${userInfo.room.id}/conquer-cell`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (!response.status) {
            socket.emit(`game-${userInfo.room.id}`, (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

document.getElementById('btn-leave').addEventListener('click', () => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { roomId: userInfo.room.id, userId: userInfo.id };
    const gameId = userInfo.room.id;

    fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        console.log(response);
        if (response.code && response.code === 'FINAL') {
            redirectTo();
        } else if (response.code && response.code === 'LEAVE') {
            socket.emit(`start-${userInfo.room.id}`, response.game);
            redirectTo();
        }
    })
    .catch(error => {});
});

const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));

socket.on(`start-${userInfo.room.id}`, (game) => {
    let playersCount = 0;

    roomBoard.classList.add('d-none');
    roomPlayerInfo.innerHTML = 'Esperando a tu rival...';
    roomPlayerScore[0].innerHTML = `0 (0%)`;
    roomPlayerScore[1].innerHTML = `0 (0%)`;

    if (game && game.players && game.players[0].id) {
        roomPlayerName[0].innerHTML = game.players[0].username;
        document.getElementById('avatar-0').setAttribute('src', '/images/' + game.players[0].avatar + '.jpg');
        roomPlayer[0].classList.remove('d-none');
        playersCount++;
    } else {
        roomPlayerName[0].innerHTML = 'Jugador 1';
        document.getElementById('avatar-0').setAttribute('src', '/images/avatar-0.jpg');
    }

    if (game && game.players && game.players[1].id) {
        roomPlayerName[1].innerHTML = game.players[1].username;
        document.getElementById('avatar-1').setAttribute('src', '/images/' + game.players[1].avatar + '.jpg');
        roomPlayer[1].classList.remove('d-none');
        playersCount++;
    } else {
        roomPlayerName[1].innerHTML = 'Jugador 2';
        document.getElementById('avatar-1').setAttribute('src', '/images/avatar-0.jpg');

    }

    if (playersCount === 2) {
        roomButtonLeave.classList.add('d-none');
        roomBoard.classList.add('d-none');
        
        var canvasList = document.querySelectorAll('.cell canvas');
        canvasList.forEach((canvas, index) => {
            const context = canvas.getContext('2d');
            context.fillStyle = '#FFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        setTimeout(() => {
            roomPlayerInfo.innerHTML = '¡Preparados!';

            setTimeout(() => {
                roomPlayerInfo.innerHTML = '¡Listos!';

                setTimeout(() => {
                    roomPlayerInfo.innerHTML = '¡Ya!';
                    roomBoard.classList.remove('d-none');
                }, 1000);
            }, 1000);
        }, 1000);
    }
});

socket.on(`game-${userInfo.room.id}`, (info) => {
    const { game, cellId, iPlayer } = info;
    const player = game.players[iPlayer];

    const canvas = canvasList[cellId - 1];
    let context = canvas.getContext('2d');
    context.fillStyle = player.color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    roomPlayerScore[iPlayer].innerHTML = `${player.score} (${player.score * 4}%)`;

    const scores = game.players.map((player) => player.score);
    const totalScore = scores[0] + scores[1];

    if (totalScore === 25) {
        const index = scores[0] > scores[1] ? 0 : 1;
        const color = index === 0 ? 'blue' : 'red';
        const winner = game.players[index];

        roomPlayerInfo.innerHTML = `¡El juego ha finalizado! Ganador: <span class='score-${color}'>${winner.username}</span>.`;
        roomButtonLeave.classList.remove('d-none');
    }
});
