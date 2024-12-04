const API = '59432216-cd12-4fc6-b167-ba6411e77806'
const movies = document.querySelector('.movies')
const form = document.querySelector('form')
const input = document.querySelector('.search')
const modal = document.querySelector('.modal')


getMovies()
async function getMovies(){
    const response = await fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1', {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API,

        }
    }).then(response => response.json())
      .then(resDate => {
        showMovies(resDate)
      })
    
}
function ratingMovie(vote){
    if(vote >= 7){
        return 'green'
    }else if(vote >= 5){
        return 'orange'
    }else {
        return 'red'
    }
}


function showMovies(data){

    movies.innerHTML = ''
    data.items.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
           <div class="movie-cover">
                    <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                    <div class="cover-effect"></div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.nameRu}</div>
                    <div class="movie-category">${movie.genres.map((genre) => genre.genre).join(', ')}</div>
                    <div class="movie-average movie-average--${ratingMovie(movie.ratingImdb)}">${movie.ratingImdb}</div>
                </div>
        `;
        movieEl.addEventListener('click', () => openModal(movie.kinopoiskId))
        movies.appendChild(movieEl)
    })
}

function showMoviesByKeyword(data){

    movies.innerHTML = ''
    input.value = ''
    data.films.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
           <div class="movie-cover">
                    <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                    <div class="cover-effect"></div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.nameRu}</div>
                    <div class="movie-category">${movie.genres.map((genre) => genre.genre).join(', ')}</div>
                    <div class="movie-average movie-average--${ratingMovie(movie.rating)}">${movie.rating}</div>
                </div>
        `;
        movieEl.addEventListener('click', () => openModal(movie.filmId))
        movies.appendChild(movieEl)
    })
}

async function searchMovie(){
    const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`+input.value, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API,

        }
    }).then(response => response.json())
      .then(resDate => {
        showMoviesByKeyword(resDate)
    })
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(input.value){
        searchMovie()
    }
})

// ...............modal.......................


async function openModal(id){
    const response = await fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/'+id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API,

        }
    })
        const respData = await response.json()

    document.body.classList.add('stop-scrolling')

    modal.innerHTML = `
         <div class="modal-movie-cover">
                    <img src="${respData.posterUrlPreview}" alt="">
                    <i class="fa-regular fa-circle-xmark" id="close"></i>
                </div>
                <h2>
                    <span class="modal-movie-title">${respData.nameRu}</span>
                    <span class="modal-modal-year"> - ${respData.year}</span>
                </h2>
                <ul>
                    <li class="modal-movie-category">Жанр - <span>${respData.genres.map((genre) => genre.genre).join(', ')}</span> </li>
                    <li class="modal-movie-time">Время: <span>${respData.filmLength} мин.</span></li>
                    <li class="modal-movie-url">Страна: - <span>${respData.countries.map((country) => country.country).join(', ')}</span> </li>
                    <li class="modal-movie-description"> Описание - ${respData.description}
                    </li>
                </ul> 
`   

    movies.appendChild(modal)
    const icon = document.querySelector('#close')
    icon.addEventListener('click', () => closeModal())
}
function closeModal(){
    modal.remove()
    document.body.classList.remove('stop-scrolling')
}
window.addEventListener('keydown', (e) => {
    if(e.keyCode === 27){
        closeModal()
    }
})














