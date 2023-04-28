const homePage = document.querySelector('.home-page');

if (window.localStorage.getItem('retroGamesUser') === null) {
    window.location.href = '/login';
} else {
    homePage.classList.remove('d-none');
    homePage.classList.add('d-flex');
}
