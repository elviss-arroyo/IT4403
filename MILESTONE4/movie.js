$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";
    const IMAGE_BASE = "https://image.tmdb.org/t/p/w300";
    const API_BASE = "https://api.themoviedb.org/3";

    let currentQuery = "";
    let currentPage = 1;
    let currentView = "grid";
    let lastSearchResults = [];
    const movieMap = {};

    // ======= CENTRAL REQUEST FUNCTION =======

    function tmdbRequest(endpoint, params, onSuccess, onError) {
        $.ajax({
            url: API_BASE + endpoint,
            method: "GET",
            data: $.extend({ api_key: API_KEY }, params),
            success: onSuccess,
            error: onError || function () {
                console.error("TMDB request failed: " + endpoint);
            }
        });
    }

    // ======= TEMPLATE HELPERS =======

    function getTemplate(id) {
        return $("#" + id).html();
    }

    function buildPoster(posterPath) {
        return posterPath
            ? IMAGE_BASE + posterPath
            : "https://via.placeholder.com/200x300?text=No+Image";
    }

    function formatMovies(movies) {
        return movies.slice(0, 10).map(function (movie) {
            const formatted = {
                id: movie.id,
                title: movie.title || "Untitled",
                release_date: movie.release_date || "N/A",
                vote_average: movie.vote_average || "N/A",
                overview: movie.overview || "No description available.",
                poster: buildPoster(movie.poster_path),
                viewClass: currentView === "list" ? "movie-list-item" : "",
                showOverview: currentView === "list"
            };
            movieMap[movie.id] = formatted;
            return formatted;
        });
    }

    // ======= RENDER FUNCTIONS =======

    function renderMovies(movies, containerSelector) {
        const $container = $(containerSelector);
        $container.empty();

        if (!movies || movies.length === 0) {
            $container.html("<p>No movies found.</p>");
            return;
        }

        const template = getTemplate("movie-card-template");
        const html = Mustache.render(template, { movies: formatMovies(movies) });
        $container.html(html);

        if (currentView === "list") {
            $container.removeClass("movie-grid").addClass("movie-list");
        } else {
            $container.removeClass("movie-list").addClass("movie-grid");
        }
    }

    function renderMovieDetails(movie) {
        const template = getTemplate("movie-details-template");
        const html = Mustache.render(template, movie);
        $("#movieDetails").html(html);
    }

    // ======= SEARCH =======

    function searchMovies() {
        tmdbRequest(
            "/search/movie",
            { query: currentQuery, page: currentPage },
            function (data) {
                lastSearchResults = data.results || [];
                renderMovies(lastSearchResults, "#resultsGrid");
                buildPagination(data.total_pages || 0);
            },
            function () {
                $("#resultsGrid").html("<p>Search failed. Please try again.</p>");
                $("#pagination").empty();
            }
        );
    }

    // ======= PAGINATION =======

    function buildPagination(totalPages) {
        $("#pagination").empty();
        if (totalPages === 0) return;

        const view = { pages: [], currentPage: currentPage };

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            view.pages.push({ number: i, active: i === currentPage });
        }

        const template = getTemplate("pagination-template");
        const $pagination = $(Mustache.render(template, view));

        $pagination.find(".page-btn").on("click", function () {
            currentPage = parseInt($(this).data("page"));
            searchMovies();
        });

        $("#pagination").append($pagination);
    }

    // ======= CATEGORY LOADERS =======

    function loadActionMovies() {
        tmdbRequest(
            "/discover/movie",
            { with_genres: 28 },
            function (data) { renderMovies(data.results || [], "#actionMovies"); },
            function () { $("#actionMovies").html("<p>Error loading action movies.</p>"); }
        );
    }

    function loadHorrorMovies() {
        tmdbRequest(
            "/discover/movie",
            { with_genres: 27 },
            function (data) { renderMovies(data.results || [], "#horrorMovies"); },
            function () { $("#horrorMovies").html("<p>Error loading horror movies.</p>"); }
        );
    }

    // ======= EVENT HANDLERS =======

    $("#searchBtn").on("click", function () {
        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;
        currentPage = 1;
        searchMovies();
    });

    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) $("#searchBtn").click();
    });

    $(document).on("click", ".movie-card", function () {
        const id = $(this).data("id");
        if (movieMap[id]) renderMovieDetails(movieMap[id]);
    });

    $("#gridViewBtn").on("click", function () {
        currentView = "grid";
        $("#gridViewBtn").addClass("active-view");
        $("#listViewBtn").removeClass("active-view");
        if (lastSearchResults.length > 0) renderMovies(lastSearchResults, "#resultsGrid");
    });

    $("#listViewBtn").on("click", function () {
        currentView = "list";
        $("#listViewBtn").addClass("active-view");
        $("#gridViewBtn").removeClass("active-view");
        if (lastSearchResults.length > 0) renderMovies(lastSearchResults, "#resultsGrid");
    });

    // ======= INITIAL LOAD =======

    loadActionMovies();
    loadHorrorMovies();

});
