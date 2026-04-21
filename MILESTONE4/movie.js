$(document).ready(function () { 

    const API_KEY = "4ecce31518d3c79af6da91dc53d038d5"; // TMDB API key

    let currentQuery = ""; 
    let currentPage = 1;  

    let currentSearchResults = []; // store for click access

    $("#searchBtn").click(function () { 
        currentQuery = $("#searchInput").val().trim(); // Get input value

        if (!currentQuery) return; // Stop if empty

        currentPage = 1; 
        searchMovies(); // Run search
    });

    function searchMovies() { // Fetch movies from API

        $.get("https://api.themoviedb.org/3/search/movie", {
            api_key: API_KEY, // API key
            query: currentQuery, // Search text
            page: currentPage // Page number
        })
        .done(function (data) { // If request succeeds

            currentSearchResults = (data.results || []).slice(0, 10);

            displayMovies(currentSearchResults, "#resultsGrid"); // Show movies

            createPagination(data.total_pages); // Create page buttons

        })
        .fail(function () { // If request fails
            console.error("Search API Error"); // Log error
        });
    }


    function displayMovies(movies, container) { // Show movies in grid

        $(container).empty(); // Clear previous results

        if (!movies) return; // Stop if no data

        let formattedMovies = movies.map((movie, index) => { // format for mustache

            let poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` // image
                : "https://via.placeholder.com/200x300?text=No+Image"; // Placeholder

            return {
                id: movie.id,
                index: index,
                title: movie.title,
                poster: poster
            };
        });

        let template = $("#movie-card-template").html(); // Mustache template
        let html = Mustache.render(template, { movies: formattedMovies });

        $(container).html(html);
    }


    function showDetails(movie) { // Show selected movie

        let poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` // image
            : "https://via.placeholder.com/300x450?text=No+Image"; // Placeholder

        let data = {
            title: movie.title,
            poster: poster,
            release_date: movie.release_date || "N/A",
            vote_average: movie.vote_average,
            overview: movie.overview || "No description available."
        };

        let template = $("#movie-details-template").html();
        let html = Mustache.render(template, data);

        $("#movieDetails").html(html);
    }


    // Click handler for movie cards
    $(document).on("click", ".movie-card", function () {

        let index = $(this).data("index");

        let movie = currentSearchResults[index];

        showDetails(movie);
    });



    function createPagination(totalPages) { // page buttons

        $("#resultsGrid .pagination").remove();

        let pagination = $('<div class="pagination"></div>');

        for (let i = 1; i <= Math.min(totalPages, 5); i++) { // pages 5

            let btn = $(`<button class="page-btn">${i}</button>`); // Create button

            if (i === currentPage) { // If active page
                btn.addClass("active"); // Highlight it
            }

            btn.click(function () { // On click
                currentPage = i; // Set page
                searchMovies(); // Reload results
            });

            pagination.append(btn); // Add button
        }

        $("#resultsGrid").append(pagination); 
    }


   
    // ACTION MOVIES
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY, // API key
        with_genres: 28 // Action genre
    })
    .done(function (data) { // success

        displayMovies((data.results || []).slice(0, 10), "#actionMovies"); // Show action movies

    })
    .fail(function () { // fail
        console.error("Action movies API error"); // error
    });




    // HORROR MOVIES
    $.get("https://api.themoviedb.org/3/discover/movie", {
        api_key: API_KEY, // API key
        with_genres: 27 // Horror genre
    })
    .done(function (data) { // success

        displayMovies((data.results || []).slice(0, 10), "#horrorMovies"); // Show horror movies

    })
    .fail(function () { // fail
        console.error("Horror movies API error"); // error
    });

});
