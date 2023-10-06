
const search = document.querySelector('#search')
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://anime-api.cyclic.cloud/"

const container = document.querySelector('.container-card')
search.addEventListener('change', function(e){
    e.preventDefault()
    let q = search.value
    getAnimeByQuery(q)
})

async function getAnimeByQuery(q){
    const anime = await fetch(`${baseUrl}search?q=${q}`)
    const animeData = await anime.json()
    const {data} = animeData;
    makeCard(data)
}
function makeCard(datas){
    datas.map(data => {
        const {title, thumbnail, slug, genres, rating} = data
        container.innerHTML += `
            <article class="card" value=${slug}>
                <h2>${title}</h2>
                <img src="${thumbnail}" alt="${slug}" />
                <ul>
                ${genres.map(genre => {
                    return `<li>${genre}</li>`  
                })}
                </ul>
                <p>rating: ${rating}</p>
                </article>`
            })
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => card.addEventListener('click',function(){
        let slug = this.getAttribute('value')
        getAnimeDetail(slug)
        modal.showModal()
    }))
}

function getAnimeDetail(slug){
    fetch(`${baseUrl}anime/${slug}`)
    .then(res => res.json())
    .then((data) => {
        const {title, thumbnail, genres, score,episodeLists} = data
        cardDetail.innerHTML =` <article class="card">
            <h2>${title}</h2>
            <img src="${thumbnail}" alt="" />
            <ul>
            ${genres.map(genre => {
                return `<li>${genre}</li>`  
            })}
            </ul>
            <p>rating: ${score}</p>
            <ul>
                ${episodeLists.map(episodeList =>{
                    const { slug } = episodeList
                    let i = slug.replace(/\D/g, '')
                    return `<li>
                        <input data-value="${slug}" type="button" value="${i}" />
                    </li>`
                }).join('')}
            </ul>
            <input id="backButton" type="button" value="Kembali" />
        </article>`
        const backButton = document.querySelector('#backButton')
        backButton.addEventListener('click',function(){
            modal.close()
        })
   })
}

