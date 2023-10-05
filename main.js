
const search = document.querySelector('#search')
const baseUrl = "https://anime-api.cyclic.cloud/"

const container = document.querySelector('.container')
search.addEventListener('change', function(e){
    e.preventDefault()
    let q = search.value
    getAnimeByQuery(q)
})

function getAnimeByQuery(q){
    fetch(`${baseUrl}search?q=${q}`)
    .then(res => res.json())
    .then(({data}) => 
        data.forEach(animeData => {
            const {title, genres, rating, thumbnail, slug} = animeData
            container.innerHTML += `<article>
                <h2>${title}</h2>
                <img src="${thumbnail}" alt="anime..." />
                <ul>
                    ${genres.map(genre => {
                        return `<li>${genre}</li>`  
                    })}
                </ul>
                <p>rating: ${rating}</p>
            </article>`
            getAnimeDetail(slug)
        }))
}
function getAnimeDetail(slug){
    fetch(`${baseUrl}anime/${slug}`)
    .then(res => res.json())
    .then((data) => {
        console.log(data)
    })
}

