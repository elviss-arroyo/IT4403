$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";
    const IMG = "https://image.tmdb.org/t/p/w200";

    let currentQuery = "";
    let currentPage = 1;
    let layout = "grid";

    let lastResults = [];

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

            lastResults = data.results;

            renderMovies(data.results, "#resultsGrid");
            buildControls(data.total_pages);
        });
    }

    /* ================= FORMAT DATA (IMPORTANT) ================= */
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

        const html = Mustache.render(template, {
            movies: formatMovies(movies)
        });

        $(container).html(html);

        applyLayout();
    }

    /* ================= MOVIE DETAILS (MUSTACHE) ================= */
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

    /* ================= CLICK EVENTS ================= */
    $(document).on("click", ".movie-card", function () {

        const id = $(this).data("id");

        $.get("https://api.themoviedb.org/3/movie/" + id, {
            api_key: API_KEY
        }).done(movie => showDetails(movie));

    });

    /* ================= CONTROLS ================= */
    function buildControls(totalPages) {

        $("#controls").empty();

        let wrapper = $('<div class="controls-wrapper"></div>');

        let pagination = $('<div class="pagination"></div>');

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {

            let btn = $(`<button class="page-btn">${i}</button>`);

            if (i === currentPage) btn.addClass("active");

            btn.click(() => {
                currentPage = i;
                searchMovies();
            });

            pagination.append(btn);
        }

        let toggle = $(`
            <div class="view-toggle">
                <button id="gridBtn">Grid</button>
                <button id="listBtn">List</button>
            </div>
        `);

        toggle.find("#gridBtn").click(() => {
            layout = "grid";
            applyLayout();
        });

        toggle.find("#listBtn").click(() => {
            layout = "list";
            applyLayout();
        });

        wrapper.append(pagination);
        wrapper.append(toggle);

        $("#controls").append(wrapper);

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
