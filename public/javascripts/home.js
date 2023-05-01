const homeWelcomeMessage = document.querySelector('.welcome-message');
const homeAvatarDragImg = document.querySelector('.avatar-drag-img');
const homeGame1 = document.querySelector('.game-1');
const homeGame2 = document.querySelector('.game-2');
const homeGame3 = document.querySelector('.game-3');
const homeGame4 = document.querySelector('.game-4');

const user = window.localStorage.getItem('retroGamesUser');

if (user === null) {
    window.location.href = '/login';
} else {
    const userInfo = JSON.parse(user);

    homeWelcomeMessage.innerHTML = 'Bienvenido ' + userInfo.username;
    homeAvatarDragImg.setAttribute('src', '/images/' + userInfo.avatar + '.jpg');
}

document.getElementById('btn-logout').addEventListener('click', () => {
    window.localStorage.removeItem('retroGamesUser');
    window.location.href = '/login';
});

function allowDrop(event) {
    event.preventDefault();
}
  
function drag(event) {
    event.dataTransfer.setData("avatar", event.target.id);
}
  
function drop(event, gameId) {
    event.preventDefault();

    var data = event.dataTransfer.getData("avatar");
    event.target.appendChild(document.getElementById(data));

    const userInfo = JSON.parse(user);

    console.log('drop');
    console.log('----------');
    console.log('User: ' + userInfo.id);
    console.log('Game: ' + gameId);
    console.log('----------');
}
