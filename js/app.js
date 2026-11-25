// Обрано Vue 3 через CDN, оскільки він підключається одним тегом без збірки та забезпечує зручну реактивність і декларативний рендер.

const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';
const CARD_COLORS = ['4f46e5', '7c3aed', '38bdf8', 'f59e0b', '10b981'];
const GENRES = ['Стратегія', 'Сімейна', 'Паті-гейм'];

const GameCard = {
    props: ['title', 'minPlayers', 'maxPlayers', 'genre', 'description', 'color', 'completed'],
    emits: ['filter'],
    computed: {
        fitsFour() {
            return 4 >= this.minPlayers && 4 <= this.maxPlayers;
        },
        imageUrl() {
            return `https://placehold.co/600x400/${this.color}/ffffff?text=${encodeURIComponent(this.title)}`;
        }
    },
    template: `
        <article class="game-card" :class="{ fits: fitsFour }" :data-players="minPlayers + '-' + maxPlayers">
            <div class="card-image-wrapper">
                <img :src="imageUrl" :alt="title">
                <div class="player-badge">👥 {{ minPlayers }}-{{ maxPlayers }} гравців</div>
            </div>
            <div class="card-content">
                <h3 class="game-title">{{ title }}</h3>
                <p class="game-description">{{ description }}</p>
                <div class="card-meta">
                    <button type="button" class="genre-badge" @click="$emit('filter', genre)">
                        🏷️ {{ genre }}
                    </button>
                    <span class="game-status" :class="completed ? 'played' : 'not-played'">
                        {{ completed ? '✅ Вже зіграно' : '🎲 Ще не зіграно' }}
                    </span>
                </div>
            </div>
        </article>
    `
};

Vue.createApp({
    components: { GameCard },
    data() {
        return {
            games: [],
            currentPlayers: '',
            selectedGenre: null,
            isLoading: false,
            apiError: '',
            formError: '',
            newGame: {
                title: '',
                minPlayers: '',
                maxPlayers: '',
                genre: ''
            }
        };
    },
    computed: {
        visibleGames() {
            return this.games.filter(game => {
                const matchesPlayers = this.currentPlayers === ''
                    || (Number(this.currentPlayers) >= game.minPlayers && Number(this.currentPlayers) <= game.maxPlayers);
                const matchesGenre = this.selectedGenre === null || game.genre === this.selectedGenre;
                return matchesPlayers && matchesGenre;
            });
        }
    },
    methods: {
        async loadGames() {
            this.isLoading = true;
            this.apiError = '';

            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`Сервер відповів кодом ${response.status}`);
                }

                const data = await response.json();

                this.games = data.map((item, index) => ({
                    id: item.id,
                    title: item.title,
                    completed: item.completed,
                    minPlayers: 2,
                    maxPlayers: 4 + (index % 3),
                    genre: GENRES[index % GENRES.length],
                    description: item.completed
                        ? 'Статус: партію в цю настільну гру вже зіграно.'
                        : 'Статус: гра ще в планах, партію не зіграно.',
                    color: CARD_COLORS[index % CARD_COLORS.length]
                }));
            } catch (error) {
                this.apiError = 'Не вдалося завантажити каталог ігор. Перевірте підключення до мережі та спробуйте ще раз.';
                console.error('Помилка завантаження даних:', error);
            } finally {
                this.isLoading = false;
            }
        },
        addGame() {
            this.formError = '';

            const title = this.newGame.title.trim();
            const minPlayers = Number(this.newGame.minPlayers);
            const maxPlayers = Number(this.newGame.maxPlayers);
            const genre = this.newGame.genre;

            if (title === '') {
                this.formError = 'Назва гри не може складатися лише з пробілів';
                return;
            }

            if (minPlayers > maxPlayers) {
                this.formError = 'Мінімальна кількість гравців не може бути більшою за максимальну';
                return;
            }

            this.games.push({
                id: Date.now(),
                title,
                completed: false,
                minPlayers,
                maxPlayers,
                genre,
                description: 'Нову гру додано користувачем. Опис ще не заповнено.',
                color: '64748b'
            });

            this.newGame = {
                title: '',
                minPlayers: '',
                maxPlayers: '',
                genre: ''
            };
        },
        filterByGenre(genre) {
            this.selectedGenre = this.selectedGenre === genre ? null : genre;
        }
    },
    mounted() {
        this.loadGames();
    }
}).mount('#app');