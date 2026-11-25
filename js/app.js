const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

let games = [];

const gamesList = document.querySelector('#games-list');
const gamesCountEl = document.querySelector('#games-count');
const form = document.querySelector('#add-game-form');
const formError = document.querySelector('#form-error');
const playersFilter = document.querySelector('#players-filter');
const refreshBtn = document.querySelector('#refresh-btn');
const loadingStatus = document.querySelector('#loading-status');
const apiError = document.querySelector('#api-error');

let currentPlayers = null;

const CARD_COLORS = ['4f46e5', '7c3aed', '38bdf8', 'f59e0b', '10b981'];

const fitsPlayers = (game, count) => count >= game.minPlayers && count <= game.maxPlayers;

function getVisibleGames() {
    return currentPlayers === null
        ? games
        : games.filter(game => fitsPlayers(game, currentPlayers));
}

function showLoading(isLoading) {
    loadingStatus.hidden = !isLoading;
    refreshBtn.disabled = isLoading;
}

function showError(message) {
    apiError.textContent = message;
}

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

    const status = document.createElement('span');
    status.classList.add('game-status', game.completed ? 'played' : 'not-played');
    status.textContent = game.completed ? '✅ Вже зіграно' : '🎲 Ще не зіграно';

    content.append(title, description, status);
    card.append(imageWrapper, content);
    return card;
}

function renderGames(list = getVisibleGames()) {
    gamesList.innerHTML = '';

    for (const game of list) {
        gamesList.append(createCard(game));
    }

    gamesCountEl.textContent = `Ігор: ${list.length}`;
}

async function loadGames() {
    showLoading(true);
    showError('');

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        const data = await response.json();
        console.log('Отримані дані з API:', data);

        games = data.map((item, index) => ({
            title: item.title,
            completed: item.completed,
            minPlayers: 2,
            maxPlayers: 4 + (index % 3),
            genre: 'З каталогу API',
            description: item.completed
                ? 'Статус: партію в цю настільну гру вже зіграно.'
                : 'Статус: гра ще в планах, партію не зіграно.',
            color: CARD_COLORS[index % CARD_COLORS.length]
        }));

        renderGames();
    } catch (error) {
        showError('Не вдалося завантажити каталог ігор. Перевірте підключення до мережі та спробуйте ще раз.');
        console.error('Помилка завантаження даних:', error);
    } finally {
        showLoading(false);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    formError.textContent = '';

    const title = form.elements.title.value.trim();
    const minPlayers = Number(form.elements.minPlayers.value);
    const maxPlayers = Number(form.elements.maxPlayers.value);
    const genre = form.elements.genre.value;

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
        completed: false,
        minPlayers,
        maxPlayers,
        genre,
        description: 'Нову гру додано користувачем. Опис ще не заповнено.',
        color: '64748b'
    });

    renderGames();
    form.reset();
});

playersFilter.addEventListener('change', () => {
    currentPlayers = playersFilter.value === '' ? null : Number(playersFilter.value);
    renderGames();
});

refreshBtn.addEventListener('click', loadGames);

loadGames();