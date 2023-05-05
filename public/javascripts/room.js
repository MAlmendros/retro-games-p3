const roomPlayer = document.querySelectorAll('.player');
const roomPlayerName = document.querySelectorAll('.player-name');
const roomPlayerImg = document.querySelectorAll('.player-img');
const roomPlayerInfo = document.querySelector('.player-info');

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
    const context = canvas.getContext("2d");
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (event) => {
        console.log(event, index + 1);
    });
});

function checkGame(userInfo) {
    fetch(`/api/games/${userInfo.room.id}`, {
        method: "GET",
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
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit('start', (response));
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
        method: "PUT",
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' }) 
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            redirectTo();
        }
        else {
            socket.emit('start', (response));
        }
    })
    .catch(error => {
        redirectTo();
    });
}

socket.on('start', (game) => {
    let playersCount = 0;

    if (game && game.players && game.players[0].id) {
        roomPlayerName[0].innerHTML = game.players[0].username;
        document.getElementById('avatar-0').setAttribute('src', '/images/' + game.players[0].avatar + '.jpg');
        roomPlayer[0].classList.remove('d-none');
        playersCount++;
    }

    if (game && game.players && game.players[1].id) {
        roomPlayerName[1].innerHTML = game.players[1].username;
        document.getElementById('avatar-1').setAttribute('src', '/images/' + game.players[1].avatar + '.jpg');
        roomPlayer[1].classList.remove('d-none');
        playersCount++;
    }

    if (playersCount === 2) {
        roomBoard.classList.add('d-none');
        
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
})
