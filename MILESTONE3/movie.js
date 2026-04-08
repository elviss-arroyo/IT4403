$(document).ready(function () {

const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

let currentQuery = "";
let currentPage = 1;

/* =========================
   SEARCH BUTTON
========================= */
$("#searchBtn").click(function () {
    currentQuery = $("#searchInput").val().trim();

    if (currentQuery === "") return;

    currentPage = 1;
    searchMovies();
});

/* =========================
   SEARCH MOVIES
========================= */
function searchMovies() {
    $.get("https://api.themoviedb.org/3/search/movie", {
        api_key: API_KEY,
        query: currentQuery,
        page: currentPage
    }, function (data) {

        if (!data.results) return;

        displayMovies(data.results, "#resultsGrid");
        createPagination(data.total_pages); // FIXED (real pages)
    });
}

/* =========================
   DISPLAY MOVIES
========================= */
function displayMovies(movies, container) {
    $(container).empty();

    movies.forEach(movie => {

        let poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Image";

        let element = $(`
            <div class="movie-card">
                <img src="${poster}">
                <p>${movie.title}</p>
            </div>
        `);

        element.click(function () {
            showDetails(movie);
        });

        $(container).append(element);
    });
}

/* =========================
   MOVIE DETAILS
========================= */
function showDetails(movie) {

    let poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image";

    $("#movieDetails").html(`
        <img src="${poster}">
        <h3>${movie.title}</h3>
        <p><strong>Release:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p>${movie.overview}</p>
    `);
}

/* =========================
   PAGINATION
========================= */
function createPagination(totalPages) {

    $(".pagination").remove();

    let pagination = `<div class="pagination">`;

    let maxPages = Math.min(totalPages, 5); // keep it clean

    for (let i = 1; i <= maxPages; i++) {

        let activeClass = (i === currentPage) ? "active-page" : "";

        pagination += `
            <button class="page-btn ${activeClass}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    pagination += `</div>`;

    $(".search-results").append(pagination);

    $(".page-btn").click(function () {
        currentPage = $(this).data("page");
        searchMovies();
    });
}

/* =========================
   DEFAULT MOVIES (FIXED)
========================= */
function loadDefaultMovies() {

    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 28 // Action
    }, function (data) {
        displayMovies(data.results, "#actionMovies");
    });

    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 27 // Horror
    }, function (data) {
        displayMovies(data.results, "#horrorMovies");
    });
}

/* LOAD DEFAULT MOVIES ON PAGE LOAD */
loadDefaultMovies();

});
