// ---------- Дані (масив із ПР №6) ----------
const games = [
    { title: 'Catan (Колонізатори)', minPlayers: 3, maxPlayers: 4, genre: 'Стратегія',
      description: 'Класична економічна стратегія для всієї родини. Здобувайте ресурси та розбудовуйте свої поселення.', color: '4f46e5' },
    { title: 'Carcassonne', minPlayers: 2, maxPlayers: 5, genre: 'Сімейна',
      description: 'Тайлоукладальна гра про розбудову середньовічних міст, доріг та монастирів.', color: '7c3aed' },
    { title: 'Ticket to Ride', minPlayers: 2, maxPlayers: 5, genre: 'Сімейна',
      description: "Побудуй свою залізничну імперію та з'єднай найбільші міста в захопливій подорожі.", color: '38bdf8' },
    { title: 'Dixit', minPlayers: 3, maxPlayers: 6, genre: 'Паті-гейм',
      description: 'Асоціативна гра з неймовірно красивими ілюстраціями, яка розвиває уяву та фантазію.', color: 'f59e0b' }
];

// ---------- Елементи DOM ----------
const gamesList = document.querySelector('#games-list');
const gamesCountEl = document.querySelector('#games-count');
const form = document.querySelector('#add-game-form');
const formError = document.querySelector('#form-error');
const playersFilter = document.querySelector('#players-filter');

// null означає «усі ігри»
let currentPlayers = null;

// Чи підходить гра для заданої кількості гравців
const fitsPlayers = (game, count) => count >= game.minPlayers && count <= game.maxPlayers;

// Ігри, які треба показати з урахуванням фільтра
function getVisibleGames() {
    return currentPlayers === null
        ? games
        : games.filter(game => fitsPlayers(game, currentPlayers));
}

// Створює картку повністю з DOM-вузлів, без innerHTML
function createCard(game) {
    const card = document.createElement('article');
    card.classList.add('game-card');
    card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
    if (fitsPlayers(game, 4)) card.classList.add('fits');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('card-image-wrapper');

    const img = document.createElement('img');
    img.src = `https://placehold.co/600x400/${game.color}/ffffff?text=${encodeURIComponent(game.title)}`;
    img.alt = game.title;

    const badge = document.createElement('div');
    badge.classList.add('player-badge');
    badge.textContent = `👥 ${game.minPlayers}-${game.maxPlayers} гравців`;

    imageWrapper.append(img, badge);

    const content = document.createElement('div');
    content.classList.add('card-content');

    const title = document.createElement('h3');
    title.classList.add('game-title');
    title.textContent = game.title;

    const description = document.createElement('p');
    description.classList.add('game-description');
    description.textContent = game.description;

    content.append(title, description);
    card.append(imageWrapper, content);
    return card;
}

// Очищає контейнер і перемальовує список
function renderGames(list = getVisibleGames()) {
    gamesList.innerHTML = '';

    for (const game of list) {
        gamesList.append(createCard(game));
    }

    gamesCountEl.textContent = `Ігор: ${list.length}`;
}

// Подія submit: додавання нової гри без перезавантаження
form.addEventListener('submit', event => {
    event.preventDefault();
    formError.textContent = '';

    const title = form.elements.title.value.trim();
    const minPlayers = Number(form.elements.minPlayers.value);
    const maxPlayers = Number(form.elements.maxPlayers.value);
    const genre = form.elements.genre.value;

    // Додаткова валідація, яка не є стандартною для HTML
    if (title === '') {
        formError.textContent = 'Назва гри не може складатися лише з пробілів';
        return;
    }

    if (minPlayers > maxPlayers) {
        formError.textContent = 'Мінімальна кількість гравців не може бути більшою за максимальну';
        return;
    }

    games.push({
        title,
        minPlayers,
        maxPlayers,
        genre,
        description: 'Нову гру додано користувачем. Опис ще не заповнено.',
        color: '64748b'
    });

    renderGames();
    form.reset();
});

// Подія change: фільтрація за кількістю гравців
playersFilter.addEventListener('change', () => {
    currentPlayers = playersFilter.value === '' ? null : Number(playersFilter.value);
    renderGames();
});

// Початковий рендер
renderGames();