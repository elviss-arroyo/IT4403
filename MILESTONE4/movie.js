$(document).ready(function () { 

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; // TMDB API key

    let currentQuery = ""; // Stores current search term
    let currentPage = 1;   // Stores current page number

    let currentSearchResults = []; // Stores search results for click access
    let currentActionMovies = [];  // Stores action movies for view switching
    let currentHorrorMovies = [];  // Stores horror movies for view switching

    let currentView = "grid"; // Default view: grid or list


    // ─── SEARCH BUTTON CLICK ─────────────────────────────────────────────────

    $("#searchBtn").click(function () { 
        currentQuery = $("#searchInput").val().trim(); // Get input value

        if (!currentQuery) return; // Stop if empty

        currentPage = 1; // Reset to first page
        $("#showSearchTab").click(); // Switch to search tab
        searchMovies(); // Run search
    });

    // Enter key triggers search
    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) { // Enter key
            $("#searchBtn").click();
        }
    });


    // ─── SEARCH MOVIES ───────────────────────────────────────────────────────

    function searchMovies() { // Fetch movies from API

        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY,    // API key
            query: currentQuery, // Search text
            page: currentPage    // Page number
        })
        .done(function (data) { // If request succeeds

            currentSearchResults = (data.results || []).slice(0, 10); // Store results

            renderMovieCards(currentSearchResults, "#resultsGrid"); // Show cards

            buildPagination(data.total_pages || 0); // Build page buttons

        })
        .fail(function () { // If request fails
            console.error("Search API Error"); // Log error
            $("#resultsGrid").html("<p>Error loading results.</p>");
        });
    }


    // ─── FORMAT MOVIES FOR MUSTACHE ──────────────────────────────────────────

    function formatMovies(movies) { // Prepare movie data for template

        return movies.map(function (movie, index) {

            let poster = movie.poster_path
                ? "https://image.tmdb.org/t/p/w200" + movie.poster_path // Poster image
                : "https://via.placeholder.com/200x300?text=No+Image";   // Fallback image

            return {
                id: movie.id,
                index: index,                            // Used for click lookup
                title: movie.title || "No Title",        // Movie title
                poster: poster,                          // Poster URL
                overview: movie.overview || "No description available.", // Overview text
                viewClass: currentView === "list" ? "list-item" : "",    // CSS class for view
                showOverview: currentView === "list"     // Show overview in list mode only
            };
        });
    }


    // ─── RENDER MOVIE CARDS ──────────────────────────────────────────────────

    function renderMovieCards(movies, container) { // Render cards via Mustache

        $(container).empty(); // Clear previous content

        if (!movies || movies.length === 0) { // No results
            $(container).html("<p>No movies found.</p>");
            return;
        }

        let formattedMovies = formatMovies(movies); // Format data

        let template = $("#movie-card-template").html(); // Get Mustache template
        let html = Mustache.render(template, { movies: formattedMovies }); // Render

        $(container).html(html); // Inject into DOM

        // Apply correct layout class
        if (currentView === "list") {
            $(container).removeClass("grid-view").addClass("list-view");
        } else {
            $(container).removeClass("list-view").addClass("grid-view");
        }
    }


    // ─── RENDER MOVIE DETAILS ────────────────────────────────────────────────

    function renderMovieDetails(movie) { // Show full details for selected movie

        let poster = movie.poster_path
            ? "https://image.tmdb.org/t/p/w300" + movie.poster_path // Detail poster
            : "https://via.placeholder.com/300x450?text=No+Image";   // Fallback

        let data = {
            title: movie.title || "No Title",
            poster: poster,
            release_date: movie.release_date || "N/A",
            vote_average: movie.vote_average || "N/A",
            original_language: movie.original_language || "N/A",
            popularity: movie.popularity || "N/A",
            overview: movie.overview || "No description available."
        };

        let template = $("#movie-details-template").html(); // Get details template
        let html = Mustache.render(template, data);         // Render

        $("#movieDetails").html(html); // Inject into details panel
    }


    // ─── MOVIE CARD CLICK ────────────────────────────────────────────────────

    $(document).on("click", ".movie-card", function () {

        let index = $(this).data("index"); // Get index from data attribute

        // Determine which dataset to pull from based on visible tab
        let movie;
        if ($("#searchTab").is(":visible")) {
            movie = currentSearchResults[index];
        } else if ($("#actionTab").is(":visible")) {
            movie = currentActionMovies[index];
        } else if ($("#horrorTab").is(":visible")) {
            movie = currentHorrorMovies[index];
        }

        if (movie) renderMovieDetails(movie); // Show details
    });


    // ─── PAGINATION ──────────────────────────────────────────────────────────

    function buildPagination(totalPages) { // Build page number buttons

        $("#pagination").empty(); // Clear old buttons

        let maxPages = Math.min(totalPages, 5); // Max 5 pages shown

        for (let i = 1; i <= maxPages; i++) {

            let btn = $('<button class="page-btn">' + i + '</button>'); // Create button

            if (i === currentPage) {
                btn.addClass("active"); // Highlight current page
            }

            btn.click(function () { // On click
                currentPage = i;    // Set page number
                searchMovies();     // Reload results
            });

            $("#pagination").append(btn); // Add to DOM
        }

        if (maxPages > 0) {
            $("#pagination").append("<span> Page: " + currentPage + "</span>"); // Page indicator
        }
    }


    // ─── VIEW TOGGLE ─────────────────────────────────────────────────────────

    $("#gridViewBtn").click(function () {
        currentView = "grid"; // Switch to grid mode

        $("#gridViewBtn").addClass("active-view");
        $("#listViewBtn").removeClass("active-view");

        // Re-render all sections with new view
        renderMovieCards(currentSearchResults, "#resultsGrid");
        renderMovieCards(currentActionMovies, "#actionMovies");
        renderMovieCards(currentHorrorMovies, "#horrorMovies");
    });

    $("#listViewBtn").click(function () {
        currentView = "list"; // Switch to list mode

        $("#listViewBtn").addClass("active-view");
        $("#gridViewBtn").removeClass("active-view");

        // Re-render all sections with new view
        renderMovieCards(currentSearchResults, "#resultsGrid");
        renderMovieCards(currentActionMovies, "#actionMovies");
        renderMovieCards(currentHorrorMovies, "#horrorMovies");
    });


    // ─── TAB SWITCHING ───────────────────────────────────────────────────────

    function setActiveTab(tabId, btnId) { // Show the selected tab, hide others

        // Hide all tabs
        $("#searchTab, #actionTab, #horrorTab").hide();

        // Show selected tab
        $(tabId).show();

        // Update active button styling
        $("#showSearchTab, #showActionTab, #showHorrorTab").removeClass("active-view");
        $(btnId).addClass("active-view");
    }

    $("#showSearchTab").click(function () {
        setActiveTab("#searchTab", "#showSearchTab"); // Show search tab
    });

    $("#showActionTab").click(function () {
        setActiveTab("#actionTab", "#showActionTab"); // Show action tab
    });

    $("#showHorrorTab").click(function () {
        setActiveTab("#horrorTab", "#showHorrorTab"); // Show horror tab
    });


    // ─── LOAD ACTION MOVIES ──────────────────────────────────────────────────

    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,  // API key
        with_genres: 28    // Action genre ID
    })
    .done(function (data) { // Success

        currentActionMovies = (data.results || []).slice(0, 10); // Store results
        renderMovieCards(currentActionMovies, "#actionMovies");   // Render cards

    })
    .fail(function () { // Fail
        console.error("Action movies API error");
        $("#actionMovies").html("<p>Error loading action movies.</p>");
    });


    // ─── LOAD HORROR MOVIES ──────────────────────────────────────────────────

    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY,  // API key
        with_genres: 27    // Horror genre ID
    })
    .done(function (data) { // Success

        currentHorrorMovies = (data.results || []).slice(0, 10); // Store results
        renderMovieCards(currentHorrorMovies, "#horrorMovies");   // Render cards

    })
    .fail(function () { // Fail
        console.error("Horror movies API error");
        $("#horrorMovies").html("<p>Error loading horror movies.</p>");
    });

});
