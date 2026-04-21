$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

    let currentQuery = "";
    let currentPage = 1;
    let layout = "grid";

    let currentSearch = [];

    $("#searchView").show();
    $("#collectionView").hide();

    /* ================= SEARCH ================= */
    $("#searchBtn").click(function () {

        $("#collectionView").hide();
        $("#searchView").show();

        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;

        currentPage = 1;
        searchMovies();
    });

    /* ================= COLLECTION ================= */
    $("#collectionBtn").click(function () {

        $("#searchView").hide();
        $("#collectionView").show();

        loadCollection(28, "#actionMovies"); // action
        loadCollection(27, "#horrorMovies"); // horror
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

            currentSearch = data.results;
            renderMovies(currentSearch, "#resultsGrid");
            buildControls(data.total_pages);
        });
    }

    /* ================= MUSTACHE FORMAT ================= */
    function formatMovies(movies) {

        return movies.slice(0, 10).map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300"
        }));
    }

    /* ================= RENDER MOVIES (MUSTACHE) ================= */
    function renderMovies(movies, container) {

        const template = $("#movie-card-template").html();

        const data = {
            movies: formatMovies(movies)
        };

        $(container).html(Mustache.render(template, data));

        applyLayout();
    }

    /* ================= DETAILS (MUSTACHE) ================= */
    function showDetails(movie) {

        const template = $("#movie-details-template").html();

        const data = {
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "https://via.placeholder.com/300x450",
            title: movie.title,
            release_date: movie.release_date || "N/A",
            vote_average: movie.vote_average,
            language: movie.original_language?.toUpperCase() || "N/A",
            overview: movie.overview || "No description"
        };

        $("#movieDetails").html(Mustache.render(template, data));
    }

    /* ================= CLICK EVENT ================= */
    $(document).on("click", ".movie-card", function () {

        const id = $(this).data("id");

        const movie =
            currentSearch.find(m => m.id === id);

        if (movie) showDetails(movie);
    });

    /* ================= CONTROLS ================= */
    function buildControls(totalPages) {

        $("#controls").empty();

        let wrapper = $('<div class="controls-wrapper"></div>');

        /* pagination */
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

        /* view toggle */
        let toggle = $(`
            <div class="view-toggle">
                <button id="gridBtn" class="view-btn active">Grid</button>
                <button id="listBtn" class="view-btn">List</button>
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
    }

    /* ================= LAYOUT ================= */
    function applyLayout() {

        if (layout === "list") {
            $("#resultsGrid, .category-grid").addClass("list-view");
        } else {
            $("#resultsGrid, .category-grid").removeClass("list-view");
        }
    }

});
