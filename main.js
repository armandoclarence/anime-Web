
const search = document.querySelector('#search')
const cardDetail = document.querySelector('.cardDetail')
const baseUrl = "https://anime-api.cyclic.cloud/"

const container = document.querySelector('.container-card')
search.addEventListener('change', function(e){
    e.preventDefault()
    let q = search.value
    getAnimeByQuery(q)
})

function getAnimeByQuery(q){
    fetch(`${baseUrl}search?q=${q}`)
    .then(res => res.json())
    .then(({data}) => 
        data.map(animeData => {
            const {title, thumbnail, genres, rating, slug} = animeData
            container.innerHTML += `
                <article class="card">
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
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => card.addEventListener('click',function(){
        console.log(this)
        cardDetail.innerHTML = `<ul>
            <li className="1"></li>
            <li className="2"></li>
            <li className="3"></li>
            <li className="4"></li>
            <li className="5"></li>
            <li className="6"></li>
            <li className="7"></li>
            <li className="8"></li>
            <li className="9"></li>
            <li className="10"></li>
        </ul>`
    }))
    fetch(`${baseUrl}anime/${slug}`)
    .then(res => res.json())
    .then((data) => {
        const {episodeLists} = data
        console.log(data);
        console.log(episodeLists)
   })
}

