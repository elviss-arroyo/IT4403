$(document).ready(function () {

const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

let currentQuery = "";
let currentPage = 1;

$("#searchBtn").click(function () {
    currentQuery = $("#searchInput").val();
    currentPage = 1;
    searchMovies();
});

function searchMovies() {
    $.get("https://api.themoviedb.org/3/search/movie", {
        api_key: API_KEY,
        query: currentQuery,
        page: currentPage
    }, function (data) {
        displayMovies(data.results, "#resultsGrid");
        createPagination(5);
    });
}

function displayMovies(movies, container) {
    $(container).empty();

    movies.slice(0, 10).forEach(movie => { 

        let poster = movie.poster_path
            ? https://image.tmdb.org/t/p/w200${movie.poster_path}
            : "https://via.placeholder.com/200x300?text=No+Image";

        let element = $(            <div class="movie-card">
                <img src="${poster}">
                <p>${movie.title}</p>
            </div>
        );
        element.click(function () {
            showDetails(movie);
        });

        $(container).append(element);
    });
}

function showDetails(movie) {
    $("#movieDetails").html(        <h3>${movie.title}</h3>
        <p><strong>Release:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p>${movie.overview}</p>
    );}

function createPagination(totalPages) {
    $("#resultsGrid .pagination").remove();

    let pagination = <div class="pagination">;

    for (let i = 1; i <= totalPages; i++) {
        pagination += <button class="page-btn" data-page="${i}">${i}</button>;
    }

    pagination += </div>;

    $("#resultsGrid").append(pagination);

    $(".page-btn").click(function () {
        currentPage = $(this).data("page");
        searchMovies();
    });
}


$.get("https://api.themoviedb.org/3/discover/movie", {
    api_key: API_KEY,
    with_genres: 28 
}, function (data) {
    displayMovies(data.results, "#actionMovies");
});
    
$.get("https://api.themoviedb.org/3/discover/movie", {
    api_key: API_KEY,
    with_genres: 27 
}, function (data) {
    displayMovies(data.results, "#horrorMovies");
});

});
