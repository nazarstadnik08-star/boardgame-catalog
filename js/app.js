console.log('app.js підключено');

const games = [
    { title: 'Catan (Колонізатори)', minPlayers: 3, maxPlayers: 4 },
    { title: 'Carcassonne', minPlayers: 2, maxPlayers: 5 },
    { title: 'Ticket to Ride', minPlayers: 2, maxPlayers: 5 },
    { title: 'Dixit', minPlayers: 3, maxPlayers: 6 }
];

const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;


const targetPlayers = 4; 
console.log(`\nШукаємо ігри для ${targetPlayers} гравців:`);

for (const game of games) {
    
    if (fitsPlayers(game, targetPlayers)) {
        console.log(`✅ ${game.title} (підходить)`);
    } else {
        console.log(`❌ ${game.title} (не підходить, потрібно ${game.minPlayers}-${game.maxPlayers} гравців)`);
    }
}