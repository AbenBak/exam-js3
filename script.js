const url = 'https://hollywood-movies.p.rapidapi.com/api/v2/released/1990';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-host': 'hollywood-movies.p.rapidapi.com',
        'x-rapidapi-key': 'bf30f6c279mshea5ccff55b8d6dep19f976jsn54f81f5acefd'
    }
};

const container = document.querySelector('div.container');
let movies = [];
if (document.title.includes('Catalog') || document.title.includes('Profile')) {
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayMovies(movies);
            setupFilters();
            setupSearch();
        })
        .catch(error => console.error('Error:', error));

    function getRandomCost() {
        return Math.floor(Math.random() * 500) + 100;
    }

    function displayMovies(movies) {
        if (!container) return;

        container.innerHTML = '';

        movies.forEach(movie => {
            if (movie.Poster) {
                const random_cost = getRandomCost();
                container.innerHTML += `
                    <div class="movie">
                        <img src="${movie.Poster}" alt="${movie.Name}" style="width: 200px; margin-right: 20px;">
                        <div class="movie-info">
                            <p class="name">Name: ${movie.Name}</p>
                            <p class="release">Release: ${movie.Release}</p>
                            <p class="cost">${random_cost}$</p>
                            <button class="add" data-movie-id="${movie.id}">Add to cart</button>
                        </div>
                    </div>
                `;
            }
        });
    }

    if (container) {
        container.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('add')) {
                if (document.title.includes('Profile')) {
                    const movieId = e.target.dataset.movieId;
                    const movieName = e.target.closest('.movie').querySelector('.name').textContent.replace('Name: ', '');
                    const movieRelease = e.target.closest('.movie').querySelector('.release').textContent.replace('Release: ', '');
                    const movieCost = parseInt(e.target.closest('.movie').querySelector('.cost').textContent.replace('$', '').trim());
                    const moviePoster = e.target.closest('.movie').querySelector('img').src;
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    if (!currentUser) {
                        alert('Пожалуйста, войдите в систему');
                        return;
                    }
                    let cart = currentUser.cart || [];
                    const existingMovieIndex = cart.findIndex(item => item.id === movieId);

                    if (existingMovieIndex > -1) {
                        cart[existingMovieIndex].quantity += 1;
                    } else {
                        cart.push({
                            id: movieId,
                            name: movieName,
                            release: movieRelease,
                            cost: movieCost,
                            poster: moviePoster,
                            quantity: 1
                        });
                    }
                    currentUser.cart = cart;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));

                    alert('Фильм добавлен в корзину');
                } else {
                    window.location = 'reg.html';
                }
            }
        });
    }

    function setupFilters() {
        const filters = document.querySelectorAll('.genre-filter');
        filters.forEach(filter => {
            filter.addEventListener('change', filterMovies);
        });
    }

    function filterMovies() {
        const selectedGenres = Array.from(document.querySelectorAll('.genre-filter:checked')).map(input => input.value);
        const filteredMovies = movies.filter(movie => {
            let movieGenres = Array.isArray(movie.Genre) ? movie.Genre : movie.Genre.split(', ').map(genre => genre.trim());
            return selectedGenres.every(genre => movieGenres.includes(genre));
        });

        displayMovies(filteredMovies);
    }

    function setupSearch() {
        const input = document.getElementById('searchBar');
        input.addEventListener('input', () => {
            const searchTerm = input.value.toLowerCase();
            const filteredMovies = movies.filter(movie => movie.Name.toLowerCase().includes(searchTerm));
            displayMovies(filteredMovies);
        });
    }
}

if (document.title.includes('Catalog')) {
    let reg_acc = document.getElementById('registerButton').onclick = function () {
        window.location = "reg.html";
    };
    let log_acc = document.getElementById('loginButton').onclick = function () {
        window.location = "auth.html"
    }
}

if (document.title.includes('profile')) {
    let cart = document.querySelector('.cart').onclick = function (e) {
        e.preventDefault();
        window.location = "cart.html";
        console.log(cart);
    }
}

if (document.title.includes('Корзина')) {
    document.addEventListener('DOMContentLoaded', () => {
        const itemsContainer = document.querySelector('.items');
        const currentUser = JSON.parse(localStorage.getItem('currentUser')); 
        let items = [];
        if (currentUser) {
            items = currentUser.cart || [];  
        }

        let totalCost = 0;

        function renderItems() {
            itemsContainer.innerHTML = ''; 
            totalCost = 0;

            if (items.length === 0) {
                itemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
                return;
            }

            items.forEach((item, index) => {
                const itemCost = item.quantity * item.cost;
                totalCost += itemCost;

                itemsContainer.innerHTML += `
                    <div class="item">
                        <img src="${item.poster}" alt="${item.name}" style="max-width: 100px; max-height: 100px;">
                        <p>Name: ${item.name}</p>
                        <p>Release: ${item.release}</p>
                        <p>Cost: ${item.cost}$</p>
                        <p>Quantity: <span class="quantity">${item.quantity}</span></p>
                        <button class="decrease" data-index="${index}">-</button>
                        <button class="increase" data-index="${index}">+</button>
                        <p>Total: ${itemCost}$</p>
                    </div>
                    <hr>
                `;
            });

            itemsContainer.innerHTML += `<p class="total-cost">Total Cost: ${totalCost}$</p>`;
        }
        itemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const index = target.dataset.index;

            if (target.classList.contains('increase')) {
                items[index].quantity += 1;  
            } else if (target.classList.contains('decrease')) {
                if (items[index].quantity > 1) {
                    items[index].quantity -= 1;  
                } else {
                    items.splice(index, 1); 
                }
            }

            if (currentUser) {
                currentUser.cart = items;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            renderItems();
        });

        renderItems();  
    });
}