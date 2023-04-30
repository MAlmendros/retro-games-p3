if (window.localStorage.getItem('retroGamesUser') === null) {
    window.location.href = '/login';
}

document.getElementById('btn-logout').addEventListener('click', () => {
    window.localStorage.removeItem('retroGamesUser');
    window.location.href = '/login';
});
