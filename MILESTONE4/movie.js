$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

    let currentQuery = "";
    let currentPage = 1;
    let layout = "grid";

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

        $("#actionMovies").empty();
        $("#horrorMovies").empty();

        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 28
        }).done(data => displayMovies(data.results, "#actionMovies"));

        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 27
        }).done(data => displayMovies(data.results, "#horrorMovies"));
    });

    /* ================= SEARCH API ================= */
    function searchMovies() {

        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY,
            query: currentQuery,
            page: currentPage
        }).done(data => {

            displayMovies(data.results, "#resultsGrid");
            buildControls(data.total_pages);
        });
    }

    /* ================= DISPLAY ================= */
    function displayMovies(movies, container) {

        $(container).empty();

        if (!movies) return;

        movies.slice(0, 10).forEach(movie => {

            let poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300";

            let card = $(`
                <div class="movie-card">
                    <img src="${poster}">
                    <p>${movie.title}</p>
                </div>
            `);

            card.click(() => showDetails(movie));
            $(container).append(card);
        });

        applyLayout();
    }

    /* ================= DETAILS ================= */
    function showDetails(movie) {

        let poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450";

        $("#movieDetails").html(`
            <img src="${poster}">
            <h3>${movie.title}</h3>
            <p><b>Release:</b> ${movie.release_date || "N/A"}</p>
            <p><b>Rating:</b> ${movie.vote_average}</p>
            <p><b>Language:</b> ${movie.original_language?.toUpperCase() || "N/A"}</p>
            <p>${movie.overview || "No description"}</p>
        `);
    }

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
                <button id="gridBtn" class="view-btn">Grid</button>
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

        applyLayout();
    }

    /* ================= LAYOUT ================= */
    function applyLayout() {

        if (layout === "list") {
            $("#resultsGrid, .category-grid").addClass("list-view");
            $("#gridBtn").removeClass("active");
            $("#listBtn").addClass("active");
        } else {
            $("#resultsGrid, .category-grid").removeClass("list-view");
            $("#listBtn").removeClass("active");
            $("#gridBtn").addClass("active");
        }
    }

});
