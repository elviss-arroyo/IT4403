$(document).ready(function () {

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5";

    let currentQuery = "";
    let currentPage = 1;
    let currentLayout = "grid";

    $("#searchView").show();
    $("#collectionView").hide();

    // SEARCH
    $("#searchBtn").click(function () {

        $("#collectionView").hide();
        $("#searchView").show();

        currentQuery = $("#searchInput").val().trim();
        if (!currentQuery) return;

        currentPage = 1;
        searchMovies();
    });

    // COLLECTIONS
    $("#collectionBtn").click(function () {

        $("#searchView").hide();
        $("#collectionView").show();

        $("#actionMovies").empty();
        $("#horrorMovies").empty();

        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 28
        }).done(function (data) {
            displayMovies(data.results, "#actionMovies");
        });

        $.get("https://api.themoviedb.org/3/discover/movie", {
            api_key: API_KEY,
            with_genres: 27
        }).done(function (data) {
            displayMovies(data.results, "#horrorMovies");
        });

    });

    // SEARCH
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

    // DISPLAY MOVIES
    function displayMovies(movies, container) {

        $(container).children(".movie-card").remove();

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

        applyLayout();
    }

    // DETAILS
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

    // PAGINATION + VIEW BUTTONS
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

        let toggle = $(`
            <div class="view-toggle">
                <button id="gridBtn" class="view-btn active">Grid</button>
                <button id="listBtn" class="view-btn">List</button>
            </div>
        `);

        toggle.find("#gridBtn").click(function () {
            currentLayout = "grid";
            $("#gridBtn").addClass("active");
            $("#listBtn").removeClass("active");
            applyLayout();
        });

        toggle.find("#listBtn").click(function () {
            currentLayout = "list";
            $("#listBtn").addClass("active");
            $("#gridBtn").removeClass("active");
            applyLayout();
        });

        $("#resultsGrid").append(pagination);
        $("#resultsGrid").append(toggle);

        applyLayout();
    }

    // LAYOUT SWITCH
    function applyLayout() {

        if (currentLayout === "grid") {
            $("#resultsGrid").removeClass("list-view");
        } else {
            $("#resultsGrid").addClass("list-view");
        }
    }

});
