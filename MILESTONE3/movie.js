$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

    let currentQuery = "";
    let currentPage = 1;

    // SEARCH BUTTON
    $("#searchBtn").click(function () {
        currentQuery = $("#searchInput").val();

        if (!currentQuery) return; // prevent empty search

        currentPage = 1;
        searchMovies();
    });

    function searchMovies() {
        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY,
            query: currentQuery,
            page: currentPage
        })
        .done(function (data) {

            displayMovies(data.results, "#resultsGrid");

            createPagination(data.total_pages);

        })
        .fail(function () {
            console.error("API Error");
        });
    }

    function displayMovies(movies, container) {

        $(container).empty();

        if (!movies) return;

        movies.slice(0, 10).forEach(movie => {

            let poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Image";

            let card = $(`
                <div class="movie-card">
                    <img src="${poster}">
                    <p>${movie.title}</p>
                </div>
            `);

            card.click(function () {
                showDetails(movie);
            });

            $(container).append(card);
        });
    }

    function showDetails(movie) {

        $("#movieDetails").html(`
            <h3>${movie.title}</h3>
            <p><strong>Release:</strong> ${movie.release_date || "N/A"}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
            <p>${movie.overview}</p>
        `);
    }

    function createPagination(totalPages) {

        $("#resultsGrid .pagination").remove();

        let pagination = $('<div class="pagination"></div>');

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {

            let btn = $(`<button class="page-btn">${i}</button>`);

            btn.click(function () {
                currentPage = i;
                searchMovies();
            });

            pagination.append(btn);
        }

        $("#resultsGrid").append(pagination);
    }

    // LOAD ACTION MOVIES
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 28
    }, function (data) {
        displayMovies(data.results, "#actionMovies");
    });

    // LOAD HORROR MOVIES
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 27
    }, function (data) {
        displayMovies(data.results, "#horrorMovies");
    });

});
