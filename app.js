const apikey = '4f2ca767';
const input = document.querySelector('#userinput');
const Btn = document.querySelector('#btn');
const loading = document.querySelector('.loading');
const watchLiBtn = document.querySelector('#watchBtn');
const toggleBtn = document.querySelector('#theme-toggle');
const body = document.body;

let lastSearchResults = [];
let lastSearchTerm = '';
let inWatchlistView = false;

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    Btn.click();
  }
});

Btn.addEventListener('click', async function () {
  inWatchlistView = false;
  loading.classList.remove('hidden');
  const inputval = input.value;
  if (inputval.length === 0) {
    lastSearchResults = [];
    lastSearchTerm = '';
    alert('Please enter a movie name');
    return;
  }
  try {
    const res = await axios.get(`https://www.omdbapi.com/?apikey=${apikey}&s=${inputval}`);
    if (res.data.Response === 'True') {
      lastSearchResults = res.data.Search;
      lastSearchTerm = inputval;
      display(lastSearchResults);
    } else {
      display([]);
    }
  } catch (e) {
    console.error('Error fetching data:', e);
  }
  loading.classList.add('hidden');
});

async function display(movies) {
  loading.classList.remove('hidden');
  const result = document.querySelector('#results');
  result.innerHTML = '<div class="row g-4"></div>';
  const row = result.querySelector('.row');

  if (movies.length == 0) {
    const nomovie = document.createElement('h3');
    nomovie.innerText = "No movies found";
    result.appendChild(nomovie);
    return;
  }

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const movieCard = document.createElement('div');
    movieCard.className = 'card h-100 shadow-sm border-0 rounded-4';
    movieCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'httpss://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'}" class="card-img-top rounded-top-4" alt="${movie.Title} poster">
      <div class="card-body d-flex flex-column">
          <h5 class="card-title">${movie.Title} (${movie.Year})</h5>
          <div class="mt-auto d-grid gap-2">
              <button class="btn btn-sm btn-outline-info detailsBtn" data-id="${movie.imdbID}">Details</button>
              <button class="btn btn-sm btn-outline-success watchlistBtn" data-id="${movie.imdbID}">Add to Watchlist</button>
          </div>
      </div>
    `;
    col.appendChild(movieCard);
    row.appendChild(col);
  });

  loading.classList.add('hidden');

  document.querySelectorAll('.detailsBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const imdbID = btn.dataset.id;
      try {
        const res = await axios.get(`https://www.omdbapi.com/?apikey=${apikey}&i=${imdbID}`);
        displayfull(res.data);
      } catch (e) {
        console.error('Error fetching details:', e);
      }
    });
  });

  document.querySelectorAll('.watchlistBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const imdbID = btn.dataset.id;
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${apikey}&i=${imdbID}`);
      const movieData = res.data;
      addToWatchlist(movieData);
    });
  });
}

async function displayfull(movie) {
  loading.classList.remove('hidden');
  const result = document.querySelector('#results');
  result.innerHTML = `
    <div class="row g-4 align-items-start">
        <div class="col-12 col-md-4">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'httpss://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'}" class="img-fluid rounded shadow w-100" alt="${movie.Title} poster">
        </div>
        <div class="col-12 col-md-8">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <button class="btn btn-outline-secondary backBtn mt-3">Back</button>
        </div>
    </div>
  `;

  document.querySelector('.backBtn').addEventListener('click', () => {
    loading.classList.remove('hidden');
    result.innerHTML = '';
    if (inWatchlistView) {
      watchLiBtn.click();
    } else if (lastSearchResults.length > 0) {
      display(lastSearchResults);
    }
    loading.classList.add('hidden');
  });

  loading.classList.add('hidden');
}

async function addToWatchlist(movieData) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const movieExists = watchlist.some(movie => movie.imdbID === movieData.imdbID);
  if (movieExists) {
    alert('Movie already in watchlist!');
    return;
  }
  watchlist.push(movieData);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  alert('Movie added to your watchlist!');
}

watchLiBtn.addEventListener('click', () => {
  inWatchlistView = true;
  loading.classList.remove('hidden');
  const result = document.querySelector('#results');
  result.innerHTML = '<div class="row g-4"></div>';
  const row = result.querySelector('.row');
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  if (watchlist.length === 0) {
    const empty = document.createElement('h3');
    empty.innerText = 'Your watchlist is empty!';
    result.appendChild(empty);
    loading.classList.add('hidden');
  } else {
    watchlist.forEach(movie => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';

      const movieCard = document.createElement('div');
      movieCard.className = 'card h-100 shadow-sm border-0 rounded-4';
      movieCard.innerHTML = `
        <div class="d-flex flex-column flex-sm-row align-items-start h-100 p-2">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : 'httpss://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'}"
               class="rounded shadow-sm mb-2 mb-sm-0 me-sm-3"
               alt="${movie.Title} poster"
               style="width: 90px; height: 135px; object-fit: cover;">
          <div class="flex-grow-1 d-flex flex-column justify-content-between">
            <div>
              <h6 class="mb-1">${movie.Title} (${movie.Year})</h6>
              <p class="mb-2 text-muted" style="font-size: 0.8rem;">${movie.Genre || 'No genre info'}</p>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-sm btn-outline-info detailsBtn" data-id="${movie.imdbID}">Details</button>
              <button class="btn btn-sm btn-outline-danger removeBtn" data-id="${movie.imdbID}">Remove</button>
            </div>
          </div>
        </div>
      `;
      col.appendChild(movieCard);
      row.appendChild(col);
    });

    document.querySelectorAll('.detailsBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const imdbID = btn.dataset.id;
        try {
          const res = await axios.get(`https://www.omdbapi.com/?apikey=${apikey}&i=${imdbID}`);
          displayfull(res.data);
        } catch (e) {
          console.error('Error fetching details:', e);
        }
      });
    });

    const bckBtn = document.createElement('button');
    bckBtn.innerText = 'Back';
    bckBtn.className = 'btn btn-outline-secondary mt-4';
    result.appendChild(bckBtn);

    bckBtn.addEventListener('click', () => {
      loading.classList.remove('hidden');
      inWatchlistView = false;
      result.innerHTML = '';
      if (lastSearchResults.length > 0) {
        display(lastSearchResults);
      }
      loading.classList.add('hidden');
    });

    document.querySelectorAll('.removeBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const imdbID = btn.dataset.id;
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Movie removed from watchlist!');
        watchLiBtn.click();
      });
    });

    const sortBtn=document.createElement('button');
    sortBtn.innerText='Sort by IMDB Rating';
    sortBtn.className='btn btn-outline-info mb-3';
    result.prepend(sortBtn);

    sortBtn.addEventListener('click',()=>{
        const sorted=[...watchlist].sort((a,b)=>{
            const ratingA=parseFloat(a.imdbRating)||0;
            const ratingB=parseFloat(b.imdbRating)||0;
            return ratingB - ratingA;
        });
        displayWatchLi(sorted);
    });
  }
  loading.classList.add('hidden');
});

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
  toggleBtn.classList.remove('btn-outline-light');
  toggleBtn.classList.add('btn-outline-dark');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const isLight = body.classList.contains('light-theme');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  toggleBtn.classList.toggle('btn-outline-light', !isLight);
  toggleBtn.classList.toggle('btn-outline-dark', isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

function displayWatchLi(movies){
    const result = document.querySelector('#results');
  result.innerHTML = '<div class="row g-4"></div>';
  const row = result.querySelector('.row');

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';

    const movieCard = document.createElement('div');
    movieCard.className = 'card h-100 shadow-sm border-0 rounded-4';
    movieCard.innerHTML = `
      <div class="d-flex flex-column flex-sm-row align-items-start h-100 p-2">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'httpss://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'}"
             class="rounded shadow-sm mb-2 mb-sm-0 me-sm-3"
             alt="${movie.Title} poster"
             style="width: 90px; height: 135px; object-fit: cover;">
        <div class="flex-grow-1 d-flex flex-column justify-content-between">
          <div>
            <h6 class="mb-1">${movie.Title} (${movie.Year})</h6>
            <p class="mb-2 text-muted" style="font-size: 0.8rem;">${movie.Genre || 'No genre info'}</p>
            <p class="mb-2" style="font-size: 0.8rem;"><strong>IMDb:</strong> ${movie.imdbRating || 'N/A'}</p>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-outline-info detailsBtn" data-id="${movie.imdbID}">Details</button>
            <button class="btn btn-sm btn-outline-danger removeBtn" data-id="${movie.imdbID}">Remove</button>
          </div>
        </div>
      </div>
    `;
    col.appendChild(movieCard);
    row.appendChild(col);
  });
  
    document.querySelectorAll('.detailsBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const imdbID = btn.dataset.id;
        try {
          const res = await axios.get(`https://www.omdbapi.com/?apikey=${apikey}&i=${imdbID}`);
          displayfull(res.data);
        } catch (e) {
          console.error('Error fetching details:', e);
        }
      });
    });

    const bckBtn = document.createElement('button');
    bckBtn.innerText = 'Back';
    bckBtn.className = 'btn btn-outline-secondary mt-4';
    result.appendChild(bckBtn);

    bckBtn.addEventListener('click', () => {
      loading.classList.remove('hidden');
      inWatchlistView = false;
      result.innerHTML = '';
      if (lastSearchResults.length > 0) {
        display(lastSearchResults);
      }
      loading.classList.add('hidden');
    });

    document.querySelectorAll('.removeBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const imdbID = btn.dataset.id;
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Movie removed from watchlist!');
        watchLiBtn.click();
      });
    });

}

