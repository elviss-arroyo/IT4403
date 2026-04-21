$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; // TMDB API key
    const IMAGE_BASE = "https://image.tmdb.org/t/p/w300"; // Base URL for poster images

    let currentQuery = ""; // Stores the current search term
    let currentPage = 1;   // Tracks the current search page
    const movieMap = {};   // Stores full movie objects by id for detail lookups

    // ======= CENTRAL REQUEST FUNCTION =======

    // All API calls go through here — keeps auth and error handling in one place
    function tmdbRequest(url, onSuccess, onError) {
        $.ajax({
            url: url,
            method: "GET",
            data: { api_key: API_KEY },
            success: onSuccess,
            error: onError || function () {
                console.error("TMDB request failed: " + url);
            }
        });
    }

    // ======= TEMPLATE HELPERS =======

    // Grab a Mustache template string from its <script type="text/template"> tag
    function getTemplate(id) {
        return $("#" + id).html();
    }

    // Build a full poster image URL or return a placeholder
    function buildPoster(posterPath) {
        return posterPath
            ? IMAGE_BASE + posterPath
            : "https://via.placeholder.com/200x300?text=No+Image";
    }

    // Format raw API movie objects into a shape Mustache templates expect
    function formatMovies(movies) {
        return movies.slice(0, 10).map(function (movie) {
            const formatted = {
                id: movie.id,
                title: movie.title || "Untitled",
                release_date: movie.release_date || "N/A",
                vote_average: movie.vote_average || "N/A",
                overview: movie.overview || "No description available.",
                poster: buildPoster(movie.poster_path)
            };
            movieMap[movie.id] = formatted; // Cache for detail panel lookups
            return formatted;
        });
    }

    // ======= RENDER FUNCTIONS =======

    // Render a grid of movie cards into any container using Mustache
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
    }

    // Render the details panel for a single movie using Mustache
    function renderMovieDetails(movie) {
        const template = getTemplate("movie-details-template");
        const html = Mustache.render(template, movie);
        $("#movieDetails").html(html);
    }

    // ======= SEARCH =======

    function searchMovies() {
        const url = "https://api.themoviedb.org/3/search/movie";

        tmdbRequest(
            url + "?query=" + encodeURIComponent(currentQuery) + "&page=" + currentPage,
            function (data) {
                renderMovies(data.results || [], "#resultsGrid");
                buildPagination(data.total_pages || 0);
            },
            function () {
                $("#resultsGrid").html("<p>Search failed. Please try again.</p>");
            }
        );
    }

    // ======= PAGINATION =======

    function buildPagination(totalPages) {
        $("#resultsGrid .pagination").remove();

        if (totalPages === 0) return;

        const view = { pages: [] };

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            view.pages.push({
                number: i,
                active: i === currentPage
            });
        }

        const template = getTemplate("pagination-template");
        const $pagination = $(Mustache.render(template, view));

        // Attach click handlers to rendered pagination buttons
        $pagination.find(".page-btn").on("click", function () {
            currentPage = parseInt($(this).data("page"));
            searchMovies();
        });

        $("#resultsGrid").append($pagination);
    }

    // ======= CATEGORY LOADERS =======

    // Load Action movies (genre id 28)
    function loadActionMovies() {
        tmdbRequest(
            "https://api.themoviedb.org/3/discover/movie?with_genres=28",
            function (data) {
                renderMovies(data.results || [], "#actionMovies");
            },
            function () {
                $("#actionMovies").html("<p>Error loading action movies.</p>");
            }
        );
    }

    // Load Horror movies (genre id 27)
    function loadHorrorMovies() {
        tmdbRequest(
            "https://api.themoviedb.org/3/discover/movie?with_genres=27",
            function (data) {
                renderMovies(data.results || [], "#horrorMovies");
            },
            function () {
                $("#horrorMovies").html("<p>Error loading horror movies.</p>");
            }
        );
    }

    // ======= EVENT HANDLERS =======

    // Search button click
    $("#searchBtn").on("click", function () {
        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;
        currentPage = 1;
        searchMovies();
    });

    // Allow pressing Enter to trigger search
    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) {
            $("#searchBtn").click();
        }
    });

    // Delegated click handler for all movie cards — works for dynamically rendered cards
    $(document).on("click", ".movie-card", function () {
        const id = $(this).data("id");
        if (movieMap[id]) {
            renderMovieDetails(movieMap[id]);
        }
    });

    // ======= INITIAL PAGE LOAD =======

    loadActionMovies();
    loadHorrorMovies();

});
