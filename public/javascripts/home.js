const homeWelcomeMessage = document.querySelector('.welcome-message');
const homeAvatarImg = document.querySelector('.avatar-home-img');

const user = window.localStorage.getItem('retroGamesUser');

if (user === null) {
    window.location.href = '/login';
} else {
    const userInfo = JSON.parse(user);

    homeWelcomeMessage.innerHTML = 'Bienvenido ' + userInfo.username;
    homeAvatarImg.setAttribute('src', '/images/' + userInfo.avatar + '.jpg');
}

document.getElementById('btn-logout').addEventListener('click', () => {
    window.localStorage.removeItem('retroGamesUser');
    window.location.href = '/login';
});
