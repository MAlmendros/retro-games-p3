const homeUserContainer = document.querySelector('.user-container');
const homeAvatarDragImg = document.querySelector('.avatar-drag-img');
const homeButtonPlay = document.querySelector('.button-play');
const homeButtonLeave = document.querySelector('.button-leave');
const homeWelcomeMessage = document.querySelector('.welcome-message');

const homeRoomContainer = document.querySelector('.room-container');
const homeRoomTitle = document.querySelectorAll('.room-title');
const homeRoomBody = document.querySelectorAll('.room-body');

const homeResponseError = document.querySelector('.response-error');
const homeResponseErrorMessage = document.querySelector('.response-error-message');

const socket = io();

if (window.localStorage.getItem('retroGamesUser') === null) {
    window.location.href = '/login';
} else {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    homeWelcomeMessage.innerHTML = 'Bienvenido ' + userInfo.username;
    homeAvatarDragImg.setAttribute('src', '/images/' + userInfo.avatar + '.jpg');

    homeUserContainer.classList.remove('d-none');
    homeUserContainer.classList.add('d-flex');

    getRooms();
}

document.getElementById('btn-logout').addEventListener('click', () => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));

    if (userInfo.room && userInfo.room.id) {
        const body = { roomId: userInfo.room.id, userId: userInfo.id };
    
        fetch('/api/rooms/remove-player', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({ 'Content-Type':  'application/json' })          
        })
        .then(data => data.json()) 
        .then(response => {
            if (response.status && response.status !== 200) {
                homeResponseErrorMessage.innerHTML = response.message;
                homeResponseError.classList.remove('d-none');
                homeResponseError.classList.add('d-flex');
            }
            else {
                homeResponseErrorMessage.innerHTML = '';
                homeResponseError.classList.remove('d-flex');
                homeResponseError.classList.add('d-none');
                
                window.localStorage.removeItem('retroGamesUser');
                window.location.href = '/login';
            }
        })
        .catch(error => {
            homeResponseErrorMessage.innerHTML = error;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');
        });

    } else {
        window.localStorage.removeItem('retroGamesUser');
        window.location.href = '/login';
    }
});

document.getElementById('btn-play').addEventListener('click', () => {
    window.location.href = '/room';
});

document.getElementById('btn-leave').addEventListener('click', () => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { roomId: userInfo.room.id, userId: userInfo.id };

    fetch('/api/rooms/remove-player', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            homeResponseErrorMessage.innerHTML = response.message;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');
        }
        else {
            homeResponseErrorMessage.innerHTML = '';
            homeResponseError.classList.remove('d-flex');
            homeResponseError.classList.add('d-none');

            window.localStorage.setItem('retroGamesUser', JSON.stringify({ ...userInfo, room: {} }));
            getRooms();
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');
    });
});

function allowDrop(event) {
    event.preventDefault();
}
  
function drag(event) {
    event.dataTransfer.setData('avatar', event.target.id);
}
  
function drop(event, roomId) {
    event.preventDefault();

    fetch(`/api/rooms/${roomId}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            homeResponseErrorMessage.innerHTML = response.message;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');
        }
        else {
            homeResponseErrorMessage.innerHTML = '';
            homeResponseError.classList.remove('d-flex');
            homeResponseError.classList.add('d-none');

            addPlayer(response);
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');
    });
}

function addPlayer(room) {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { roomId: room.id, userId: userInfo.id };

    fetch('/api/rooms/add-player', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            homeResponseErrorMessage.innerHTML = response.message;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');
        }
        else {
            homeResponseErrorMessage.innerHTML = '';
            homeResponseError.classList.remove('d-flex');
            homeResponseError.classList.add('d-none');

            window.localStorage.setItem('retroGamesUser', JSON.stringify({ ...userInfo, room }));
            getRooms();
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');
    });
}

function getRooms() {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    homeButtonPlay.classList.add('d-none');
    homeButtonLeave.classList.add('d-none');

    fetch('/api/rooms', {
        method: 'GET',
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            homeResponseErrorMessage.innerHTML = response.message;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');

            homeRoomContainer.classList.remove('d-flex');
            homeRoomContainer.classList.add('d-none');
        }
        else {
            socket.emit('home', (response));
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');

        homeRoomContainer.classList.remove('d-flex');
        homeRoomContainer.classList.add('d-none');
    });
}

socket.on('home', (rooms) => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    
    rooms.forEach((room, index) => {
        homeRoomTitle[index].innerHTML = room.name;

        if (room.players.length > 0) {
            let roomPlayers = '';
            let color = 'blue';

            room.players.forEach(player => {
                roomPlayers += '<div class="row mb-3">';
                roomPlayers += '<div class="col-4">';
                roomPlayers += '<img class="avatar-drag-img-' + color +'" draggable="false" height="auto" width="100%" src="/images/' + player.avatar + '.jpg">';
                roomPlayers += '</div>';
                roomPlayers += '<div class="col-8 my-auto">';
                roomPlayers += '<p class="my-auto">' + player.username + '</p>';
                roomPlayers += '</div>';
                roomPlayers += '</div>';

                color = color === 'blue' ? 'red' : 'blue';

                if (player.id === userInfo.id) {
                    homeButtonPlay.classList.remove('d-none');
                    homeButtonLeave.classList.remove('d-none');
                }
            });

            homeRoomBody[index].innerHTML = roomPlayers;
        } else {
            homeRoomBody[index].innerHTML = '';
        }
    });

    homeRoomContainer.classList.remove('d-none');
    homeRoomContainer.classList.add('d-flex');
});
