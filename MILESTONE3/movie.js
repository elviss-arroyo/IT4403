<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; 

let currentQuery = "";
let currentPage = 1;

$("#searchBtn").click(function () {
    currentQuery = $("#searchInput").val();
    currentPage = 1;
    searchMovies();
});

function searchMovies() {
    $.get(`https://api.themoviedb.org/3/search/movie`, {
        api_key: API_KEY,
        query: currentQuery,
        page: currentPage
    }, function (data) {
        displayMovies(data.results, "#resultsGrid");
        createPagination(data.total_pages);
    });
}

function displayMovies(movies, container) {
    $(container).empty();

    movies.forEach(movie => {
        let poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "";

        let element = $(`
            <div class="movie-card">
                <img src="${poster}" alt="${movie.title}">
                <p>${movie.title}</p>
            </div>
        `);

        element.click(function () {
            showDetails(movie);
        });

        $(container).append(element);
    });
}

function showDetails(movie) {
    $("#movieDetails").html(`
        <h3>${movie.title}</h3>
        <p><strong>Release:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p>${movie.overview}</p>
    `);
}

function createPagination(totalPages) {
    $("#resultsGrid .pagination").remove();

    let pagination = `<div class="pagination">`;

    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        pagination += `<button class="page-btn" data-page="${i}">${i}</button>`;
    }

    pagination += `</div>`;

    $("#resultsGrid").append(pagination);

    $(".page-btn").click(function () {
        currentPage = $(this).data("page");
        searchMovies();
    });
}

$.get("https://api.themoviedb.org/3/discover/movie", {
    api_key: API_KEY,
    with_genres: 16
}, function (data) {
    displayMovies(data.results, "#animationMovies");
});

$.get("https://api.themoviedb.org/3/discover/movie", {
    api_key: API_KEY,
    with_genres: 27
}, function (data) {
    displayMovies(data.results, "#horrorMovies");
});
