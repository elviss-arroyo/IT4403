$(document).ready(function () { 
    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; // TMDB API key
    let currentQuery = ""; 
    let currentPage = 1;

    // ======= MUSTACHE TEMPLATE HELPERS =======

    // Grab a Mustache template from the HTML by its script tag ID
    function getTemplate(id) {
        return $("#" + id).html();
    }

    // Build a poster URL or return a placeholder
    function getPoster(path, size) {
        return path
            ? "https://image.tmdb.org/t/p/" + size + path
            : "https://via.placeholder.com/200x300?text=No+Image";
    }

    // ======= SEARCH =======

    $("#searchBtn").click(function () { 
        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;
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
            console.error("Search API Error");
        });
    }

    // ======= DISPLAY MOVIES WITH MUSTACHE =======

    function displayMovies(movies, container) {
        $(container).empty();
        if (!movies || movies.length === 0) return;

        // Build the view object Mustache expects
        // Each movie gets a pre-built poster URL added to it
        const view = {
            movies: movies.slice(0, 10).map(function (movie) {
                return {
                    id: movie.id,
                    title: movie.title,
                    release_date: movie.release_date || "N/A",
                    vote_average: movie.vote_average,
                    overview: movie.overview || "No description available.",
                    poster_path: movie.poster_path || "",
                    poster: getPoster(movie.poster_path, "w200") // pre-built for template
                };
            })
        };

        // Render cards using Mustache template
        const template = getTemplate("movie-card-template");
        const html = Mustache.render(template, view);
        $(container).append(html);

        // Attach click handlers to rendered cards
        $(container).find(".movie-card").click(function () {
            const card = $(this);
            // Read data stored in data attributes on the card
            showDetails({
                title: card.data("title"),
                release_date: card.data("release"),
                vote_average: card.data("rating"),
                overview: card.data("overview"),
                poster_path: card.data("poster")
            });
        });
    }

    // ======= MOVIE DETAILS WITH MUSTACHE =======

    function showDetails(movie) {
        const view = {
            title: movie.title,
            release_date: movie.release_date || "N/A",
            vote_average: movie.vote_average,
            overview: movie.overview || "No description available.",
            poster: getPoster(movie.poster_path, "w300")
        };

        const template = getTemplate("movie-details-template");
        const html = Mustache.render(template, view);
        $("#movieDetails").html(html);
    }

    // ======= PAGINATION WITH MUSTACHE =======

    function createPagination(totalPages) {
        $("#resultsGrid .pagination").remove();

        // Build pages array for Mustache {{#pages}} loop
        const view = {
            pages: []
        };
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            view.pages.push({
                number: i,
                active: i === currentPage // Mustache uses this for {{#active}} active{{/active}}
            });
        }

        const template = getTemplate("pagination-template");
        const html = Mustache.render(template, view);
        const $pagination = $(html);

        // Attach click handlers to pagination buttons
        $pagination.find(".page-btn").click(function () {
            currentPage = parseInt($(this).data("page"));
            searchMovies();
        });

        $("#resultsGrid").append($pagination);
    }

    // ======= CATEGORY GRIDS (Action & Horror) WITH MUSTACHE =======

    // Action Movies
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 28 // Action
    })
    .done(function (data) {
        displayMovies(data.results, "#actionMovies");
    })
    .fail(function () {
        console.error("Action movies API error");
    });

    // Horror Movies
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,
        with_genres: 27 // Horror
    })
    .done(function (data) {
        displayMovies(data.results, "#horrorMovies");
    })
    .fail(function () {
        console.error("Horror movies API error");
    });

});
