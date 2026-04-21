$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

    let currentQuery = "";
    let currentPage = 1;
    let currentLayout = "grid";

    /* ======================
        INITIAL VIEW STATE
    ======================= */
    $("#searchView").show();
    $("#collectionView").hide();

    /* ======================
        SEARCH BUTTON
    ======================= */
    $("#searchBtn").click(function () {

        $("#collectionView").hide();
        $("#searchView").show();

        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;

        currentPage = 1;
        searchMovies();
    });

    /* ======================
        COLLECTION BUTTON
    ======================= */
    $("#collectionBtn").click(function () {

        $("#searchView").hide();
        $("#collectionView").show();

        $("#actionMovies").empty();
        $("#horrorMovies").empty();

        // ACTION
        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 28
        }).done(function (data) {
            displayMovies(data.results, "#actionMovies");
        });

        // HORROR
        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 27
        }).done(function (data) {
            displayMovies(data.results, "#horrorMovies");
        });
    });

    /* ======================
        SEARCH API
    ======================= */
    function searchMovies() {

        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY,
            query: currentQuery,
            page: currentPage
        }).done(function (data) {

            displayMovies(data.results, "#resultsGrid");
            createPagination(data.total_pages);
        });
    }

    /* ======================
        DISPLAY MOVIES
    ======================= */
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

            card.click(() => showDetails(movie));

            $(container).append(card);
        });

        applyLayout(); // apply grid/list after render
    }

    /* ======================
        MOVIE DETAILS
    ======================= */
    function showDetails(movie) {

        let poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image";

        $("#movieDetails").html(`
            <img src="${poster}">
            <h3>${movie.title}</h3>

            <p><strong>Release:</strong> ${movie.release_date || "N/A"}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
            <p><strong>Language:</strong> ${movie.original_language?.toUpperCase() || "N/A"}</p>

            <p>${movie.overview || "No description available."}</p>
        `);
    }

    /* ======================
        PAGINATION + VIEW TOGGLE
    ======================= */
    function createPagination(totalPages) {

        $("#resultsGrid .pagination, #resultsGrid .view-toggle").remove();

        let pagination = $('<div class="pagination"></div>');

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {

            let btn = $(`<button class="page-btn">${i}</button>`);

            if (i === currentPage) btn.addClass("active");

            btn.click(function () {
                currentPage = i;
                searchMovies();
            });

            pagination.append(btn);
        }

        /* VIEW TOGGLE (GRID / LIST) */
        let toggle = $(`
            <div class="view-toggle">
                <button id="gridBtn" class="view-btn">Grid</button>
                <button id="listBtn" class="view-btn">List</button>
            </div>
        `);

        $("#resultsGrid").append(pagination);
        $("#resultsGrid").append(toggle);

        // default active
        setActiveButton();

        $("#gridBtn").click(function () {
            currentLayout = "grid";
            setActiveButton();
            applyLayout();
        });

        $("#listBtn").click(function () {
            currentLayout = "list";
            setActiveButton();
            applyLayout();
        });

        applyLayout();
    }

    /* ======================
        VIEW STYLE HANDLER
    ======================= */
    function applyLayout() {

        if (currentLayout === "list") {
            $("#resultsGrid").addClass("list-view");
            $(".category-grid").addClass("list-view");
        } else {
            $("#resultsGrid").removeClass("list-view");
            $(".category-grid").removeClass("list-view");
        }
    }

    function setActiveButton() {
        $("#gridBtn, #listBtn").removeClass("active");

        if (currentLayout === "grid") {
            $("#gridBtn").addClass("active");
        } else {
            $("#listBtn").addClass("active");
        }
    }

});
