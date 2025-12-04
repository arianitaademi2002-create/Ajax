const API_KEY = "7b28169b";

const form = document.getElementById("searchForm");
const resultsDiv = document.getElementById("results");
const paginationDiv = document.getElementById("pagination");
const detailsDiv = document.getElementById("details");

form.addEventListener("submit", function(e){
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value;

    if (!title) return;

    searchMovies(title, type, 1);
});

function searchMovies(title, type, page) {
    resultsDiv.innerHTML = "<p>Loading...</p>";
    detailsDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&type=${type}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                resultsDiv.innerHTML = "<p>Movie not found!</p>";
                return;
            }

            displayResults(data.Search);
            createPagination(Math.ceil(data.totalResults / 10), title, type);
        });
}

function displayResults(movies) {
    resultsDiv.innerHTML = "";

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-item");

        movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/100x150?text=No+Image'}" width="100">
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
            <button onclick="loadDetails('${movie.imdbID}')">Details</button>
        `;

        resultsDiv.appendChild(movieDiv);
    });
}

function createPagination(totalPages, title, type) {
    paginationDiv.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = () => searchMovies(title, type, i);
        paginationDiv.appendChild(btn);
    }
}

function loadDetails(imdbID) {
    detailsDiv.innerHTML = "<p>Loading details...</p>";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
        .then(res => res.json())
        .then(data => {
            detailsDiv.innerHTML = `
                <h2>${data.Title}</h2>
                <img src="${data.Poster}" width="150">
                <p><strong>Year:</strong> ${data.Year}</p>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Actors:</strong> ${data.Actors}</p>
                <p><strong>Plot:</strong> ${data.Plot}</p>
            `;
        });
}

window.loadDetails = loadDetails;