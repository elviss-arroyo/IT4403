const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; 
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const resultsGrid = document.getElementById("resultsGrid");
const movieDetails = document.getElementById("movieDetails");

const animationMovies = document.getElementById("animationMovies");
const horrorMovies = document.getElementById("horrorMovies");

// Pagination
let currentPage = 1;
let currentQuery = "";

/* SEARCH MOVIES */
searchBtn.addEventListener("click", () => {
    currentQuery = searchInput.value;
    currentPage = 1;
    fetchMovies(currentQuery, currentPage);
});

function fetchMovies(query, page) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            displayMovies(data.results, resultsGrid);
            createPagination(data.total_pages);
        });
}

/* DISPLAY MOVIES */
function displayMovies(movies, container) {
    container.innerHTML = "";

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie-card");

        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;

        div.addEventListener("click", () => {
            showDetails(movie);
        });

        container.appendChild(div);
    });
}

/* MOVIE DETAILS */
function showDetails(movie) {
    movieDetails.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Release:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p>${movie.overview}</p>
    `;
}

/*   PAGINATION*/
function createPagination(totalPages) {
    const container = document.createElement("div");
    container.classList.add("pagination");

    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === currentPage) {
            btn.style.fontWeight = "bold";
        }

        btn.addEventListener("click", () => {
            currentPage = i;
            fetchMovies(currentQuery, currentPage);
        });

        container.appendChild(btn);
    }

    resultsGrid.appendChild(container);
}

/* PREDEFINED CATEGORIES */

// Animation (genre 16)
fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16`)
    .then(res => res.json())
    .then(data => displayMovies(data.results, animationMovies));

// Horror (genre 27)
fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`)
    .then(res => res.json())
    .then(data => displayMovies(data.results, horrorMovies));
