$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";
    const IMG = "https://image.tmdb.org/t/p/w200";

    let currentQuery = "";
    let currentPage = 1;
    let layout = "grid";

    /* ================= INIT ================= */
    $("#searchView").show();
    $("#collectionView").hide();

    /* ================= SEARCH ================= */
    $("#searchBtn").click(function () {

        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;

        currentPage = 1;

        $("#collectionView").hide();
        $("#searchView").show();

        searchMovies();
    });

    /* ================= COLLECTIONS ================= */
    $("#collectionBtn").click(function () {

        $("#searchView").hide();
        $("#collectionView").show();

        loadCollection(28, "#actionMovies");
        loadCollection(27, "#horrorMovies");
    });

    function loadCollection(genre, container) {

        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: genre
        }).done(data => {
            renderMovies(data.results, container);
        });
    }

    /* ================= SEARCH API ================= */
    function searchMovies() {

        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY,
            query: currentQuery,
            page: currentPage
        }).done(data => {

            renderMovies(data.results, "#resultsGrid");
            buildControls(data.total_pages);
        });
    }

    /* ================= FORMAT DATA ================= */
    function formatMovies(movies) {
        return movies.map(m => ({
            id: m.id,
            title: m.title,
            poster: m.poster_path
                ? IMG + m.poster_path
                : "https://via.placeholder.com/200x300"
        }));
    }


/* ================= MUSTACHE RENDER ================= */
function renderMovies(movies, container) {
    const template = $("#movie-template").html();
    
    // 1. Slice the array to get only the first 10
    const limitedMovies = movies.slice(0, 10);

    // 2. Pass limitedMovies (NOT movies) to formatMovies
    const html = Mustache.render(template, {
        movies: formatMovies(limitedMovies) 
    });

    $(container).html(html);

    applyLayout();
}

    /* ================= DETAILS ================= */
    function showDetails(movie) {

        const template = $("#details-template").html();

        const data = {
            poster: movie.poster_path
                ? "https://image.tmdb.org/t/p/w300" + movie.poster_path
                : "https://via.placeholder.com/300x450",
            title: movie.title,
            release_date: movie.release_date || "N/A",
            vote_average: movie.vote_average,
            language: (movie.original_language || "N/A").toUpperCase(),
            overview: movie.overview || "No description available"
        };

        $("#movieDetails").html(Mustache.render(template, data));
    }

    /* ================= CLICK MOVIE ================= */
    $(document).on("click", ".movie-card", function () {

        const id = $(this).data("id");

        $.get("https://api.themoviedb.org/3/movie/" + id, {
            api_key: API_KEY
        }).done(movie => showDetails(movie));

    });

    /* ================= MUSTACHE PAGINATION (FIXED) ================= */
function buildControls(totalPages) {
    const template = $("#controls-template").html();
    
    // 1. Create the data for Mustache
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        pages.push({
            number: i,
            active: i === currentPage ? "active" : ""
        });
    }

    // 2. Render the template
    const html = Mustache.render(template, { pages: pages });
    $("#controls").html(html);

    // 3. Re-attach the click events (since Mustache replaced the HTML)
    $(".page-btn").click(function() {
        currentPage = parseInt($(this).data("page"));
        searchMovies();
    });

    $("#gridBtn").click(() => {
        layout = "grid";
        applyLayout();
    });

    $("#listBtn").click(() => {
        layout = "list";
        applyLayout();
    });

    applyLayout();
}
    /* ================= GRID / LIST ================= */
    function applyLayout() {

        if (layout === "list") {
            $("#resultsGrid, #actionMovies, #horrorMovies").addClass("list-view");
        } else {
            $("#resultsGrid, #actionMovies, #horrorMovies").removeClass("list-view");
        }
    }

});
