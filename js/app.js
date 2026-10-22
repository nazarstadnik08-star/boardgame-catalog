console.log('script.js підключено');

const games = [
    { title: 'Catan (Колонізатори)', minPlayers: 3, maxPlayers: 4 },
    { title: 'Carcassonne', minPlayers: 2, maxPlayers: 5 },
    { title: 'Ticket to Ride', minPlayers: 2, maxPlayers: 5 },
    { title: 'Dixit', minPlayers: 3, maxPlayers: 6 }
];

const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

const placeholder = document.querySelector('.game-card');
if (placeholder) {
    placeholder.remove();
}

const listContainer = document.querySelector('#games-list');
const gamesCountEl = document.querySelector('#games-count'); 

function renderGames(gamesArray) {
    listContainer.innerHTML = ''; 
    
    for (const game of gamesArray) {
        const card = document.createElement('article');
        card.classList.add('game-card');
        
        // Створюємо обгортку для контенту (щоб спрацювали відступи з CSS)
        const content = document.createElement('div');
        content.classList.add('card-content');
        
        const title = document.createElement('h3');
        title.classList.add('game-title'); // Додаємо клас для гарного шрифту Nunito
        title.textContent = game.title;
        
        const playersInfo = document.createElement('p');
        playersInfo.classList.add('game-description'); // Додаємо клас для описання
        playersInfo.textContent = `👥 ${game.minPlayers}-${game.maxPlayers} гравців`;
        
        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
        
        if (fitsPlayers(game, 4)) {
            card.classList.add('fits');
        }
        
        content.append(title, playersInfo);
        card.append(content);
        listContainer.append(card);
    }
    
    if (gamesCountEl) {
        gamesCountEl.textContent = `Кількість ігор у списку: ${gamesArray.length}`;
    }
}