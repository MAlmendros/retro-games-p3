const homeUserContainer = document.querySelector('.user-container');
const homeAvatarDragImg = document.querySelector('.avatar-drag-img');
const homeButtonLeave = document.querySelector('.button-leave');
const homeWelcomeMessage = document.querySelector('.welcome-message');

const homeGameContainer = document.querySelector('.game-container');
const homeGameTitle = document.querySelectorAll('.game-title');
const homeGameBody = document.querySelectorAll('.game-body');

const homeResponseError = document.querySelector('.response-error');
const homeResponseErrorMessage = document.querySelector('.response-error-message');

if (window.localStorage.getItem('retroGamesUser') === null) {
    window.location.href = '/login';
} else {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    homeWelcomeMessage.innerHTML = 'Bienvenido ' + userInfo.username;
    homeAvatarDragImg.setAttribute('src', '/images/' + userInfo.avatar + '.jpg');

    homeUserContainer.classList.remove('d-none');
    homeUserContainer.classList.add('d-flex');

    getGames();
}

document.getElementById('btn-logout').addEventListener('click', () => {
    window.localStorage.removeItem('retroGamesUser');
    window.location.href = '/login';
});

document.getElementById('btn-leave').addEventListener('click', () => {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { gameId: userInfo.game, userId: userInfo.id };

    fetch('/api/games/remove-player', {
        method: "POST",
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

            window.localStorage.setItem('retroGamesUser', JSON.stringify({ ...userInfo, game: null }));
            getGames();
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
    event.dataTransfer.setData("avatar", event.target.id);
}
  
function drop(event, gameId) {
    event.preventDefault();

    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    const body = { gameId, userId: userInfo.id };

    fetch('/api/games/add-player', {
        method: "POST",
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

            window.localStorage.setItem('retroGamesUser', JSON.stringify({ ...userInfo, game: gameId }));
            getGames();
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');
    });
}

function getGames() {
    const userInfo = JSON.parse(window.localStorage.getItem('retroGamesUser'));
    homeButtonLeave.classList.add('d-none');

    fetch('/api/games', {
        method: "GET",
        headers: new Headers({ 'Content-Type':  'application/json' })          
    })
    .then(data => data.json()) 
    .then(response => {
        if (response.status && response.status !== 200) {
            homeResponseErrorMessage.innerHTML = response.message;
            homeResponseError.classList.remove('d-none');
            homeResponseError.classList.add('d-flex');

            homeGameContainer.classList.remove('d-flex');
            homeGameContainer.classList.add('d-none');
        }
        else {
            response.forEach((game, index) => {
                homeGameTitle[index].innerHTML = game.name;

                if (game.players.length > 0) {
                    let gamePlayers = '';
                    let color = 'blue';

                    game.players.forEach(player => {
                        gamePlayers += '<div class="row mb-3">';
                        gamePlayers += '<div class="col-4">';
                        gamePlayers += '<img class="avatar-drag-img-' + color +'" draggable="false" height="auto" width="100%" src="/images/' + player.avatar + '.jpg">';
                        gamePlayers += '</div>';
                        gamePlayers += '<div class="col-8 my-auto">';
                        gamePlayers += '<p class="my-auto">' + player.username + '</p>';
                        gamePlayers += '</div>';
                        gamePlayers += '</div>';

                        color = color === 'blue' ? 'red' : 'blue';

                        if (player.id === userInfo.id) {
                            homeButtonLeave.classList.remove('d-none');
                        }
                    });

                    homeGameBody[index].innerHTML = gamePlayers;
                } else {
                    homeGameBody[index].innerHTML = '';
                }
            });

            homeGameContainer.classList.remove('d-none');
            homeGameContainer.classList.add('d-flex');
        }
    })
    .catch(error => {
        homeResponseErrorMessage.innerHTML = error;
        homeResponseError.classList.remove('d-none');
        homeResponseError.classList.add('d-flex');

        homeGameContainer.classList.remove('d-flex');
        homeGameContainer.classList.add('d-none');
    });
}
