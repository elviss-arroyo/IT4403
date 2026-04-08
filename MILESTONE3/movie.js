/* Global variables */
:root {
    --background: #F0F0F0;
    --text: #000000;
    --dim-text: #555555;
    --hover: #A9A9A9;
}

/* Page setup */
body {
    background-color: var(--background);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Header */
header {
    padding: 50px 10%;
    text-align: center;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
}

header p {
    font-size: 1.3rem;
    color: var(--dim-text);
}

/* Container */
.container {
    flex-grow: 1;
    padding: 0 5%;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* Search */
.search-section {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

#searchInput {
    padding: 10px;
    width: 300px;
}

#searchBtn {
    padding: 10px 20px;
    background: black;
    color: white;
    border: none;
    cursor: pointer;
}


.content-row {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

/* LEFT: Search Results */
.search-results {
    flex: 3;
    padding: 20px;
    background: white;
    border: 1px solid #ddd;
    text-align: center;
}

/* RIGHT: Movie Details */
.movie-details {
    flex: 1;
    padding: 20px;
    background: white;
    border: 1px solid #ddd;
    text-align: center;

    position: sticky;
    top: 20px; /* stays visible when scrolling */
}

/* GRID */
#resultsGrid,
.category-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
}

/* Movie Card */
.movie-card {
    background: white;
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
    text-align: center;
}

.movie-card img {
    width: 100%;
    border-radius: 4px;
}

.movie-card p {
    margin-top: 10px;
}

/* Movie Details */
#movieDetails {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

/* 🔥 BIGGER POSTER */
#movieDetails img {
    max-width: 320px;
    border-radius: 6px;
}

.movie-details p {
    color: var(--dim-text);
}

/* Categories */
.categories {
    margin-top: 40px;
    padding: 20px;
    background: white;
    border: 1px solid #ddd;
    text-align: center;
}

/* Pagination */
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.page-btn {
    padding: 8px 12px;
    background: black;
    color: white;
    border: none;
    cursor: pointer;
}

.active-page {
    background: white;
    color: black;
    border: 2px solid black;
    font-weight: bold;
}
