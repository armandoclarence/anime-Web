
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://api.jikan.moe/v4/"
const container = document.querySelector('.container-card') 

export async function getAnimeGenre(){
    const anime = await fetch(`${baseUrl}genres/anime`)
    const genres = await anime.json()
    const {data} = genres;
    return data
}

export async function getAnimeByGenre(id){
    const anime = await fetch(`${baseUrl}anime?genres=${id}`)
    const genres = await anime.json()
    const {data} = genres;
    makeCard(data)
}

export async function getAnimeCompleted(page){
    const anime = await fetch(`${baseUrl}anime?page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    console.log(data)
    makeCard(data)
}

export async function getAnimeByQuery(query){
    const anime = await fetch(`${baseUrl}anime?q=${query}`)
    const animeData = await anime.json()
    const {data} = animeData;
    makeCard(data)
}

export function makeCard(datas){
    container.innerHTML = ''
    datas.map(data => {
        const {title, mal_id, score, aired, images} = data
        container.innerHTML += `
        <article class="card home" id=${mal_id}>
            <img src="${images.jpg.image_url}" title="${title}" />
        </article>`
    })
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => {

        card.addEventListener('click',function(){
            let id = this.getAttribute('id')
            console.log(id)
            getAnimeDetail(id)
            modal.showModal()
        })
    })
}

async function getAnimeDetail(id){
    const anime = await fetch(`${baseUrl}anime/${id}/full`)
    const animeData = await anime.json()
    const {data} = animeData
    const {title,genres,images,score} = data
    console.log(genres)
    console.log(data)
    cardDetail.innerHTML =`<article class="card detail">
        <h2>${title}</h2>
        <img src="${images.jpg.image_url}" alt="" />
        <ul>
            ${genres.map(({name}) => {
                return `<li>${name}</li>`  
            })}
        </ul>
        <p>rating: ${score}</p>
        <input id="backButton" type="button" value="Kembali" />
    </article>`
    const episodeButtons = document.querySelectorAll('button[data-value]')
    getAnimeEpisode(episodeButtons)
    const backButton = document.querySelector('#backButton')
    backButton.addEventListener('click',function(){
        modal.close()
    })
}

function getAnimeEpisode(episodeButtons){
    episodeButtons.forEach(episodeButton => {
        let episode = episodeButton.getAttribute('data-value')
        let episodeNum = episodeButton.getAttribute('number')
        fetch(`${baseUrl}episode/${episode}`)
        .then(res => res.json())
        .then(({streamLink})=>{
            episodeButton.innerHTML += `<a href="${streamLink}" target="_blank">${episodeNum}</a>`
        })
    })
}
