
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const container = document.querySelector('.container') 

export async function getAnimeGenre(){
    const anime = await fetch(`${baseUrl}genres/anime`)
    const genres = await anime.json()
    const {data} = genres;
    return data
}

export async function getAnimeByGenre(id,page){
    const anime = await fetch(`${baseUrl}anime?genres=${id}&page=${page}`)
    const genres = await anime.json()
    const {data} = genres;
    console.log(data)
    makeCard(data)
}

export async function getAnimeCompleted(page){
    const anime = await fetch(`${baseUrl}top/anime?page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    console.log(data)
    makeCard(data)
}

export async function getAnimeByQuery(query,page){
    const anime = await fetch(`${baseUrl}anime?q=${query}&page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    if(data.length < 25){
        pages.innerHTML = ''
    }
    console.log(data)
    makeCard(data)
}
export function makeCard(datas){    
    container.innerHTML = '' 
    datas.map(data => {
        const {title,type, episodes, mal_id, images} = data
        container.innerHTML += `
        <article class="card home" id=${mal_id}>
            <img src="${images.jpg.image_url}" title="${title}" />
            <div class="type">${type}</div>
            <div class="type eps">${episodes}</div>
        </article>`
    })
    let cards = document.querySelectorAll('.card')
    cards.forEach(card => {

        card.addEventListener('click',function(){
            let id = this.getAttribute('id')
            getAnimeDetail(id)
            modal.showModal()
        })
    })
}

async function getAnimeDetail(id){
    const anime = await fetch(`${baseUrl}anime/${id}`)
    const animeData = await anime.json()
    const {data} = animeData
    const {title, images, genres, score} = data
    cardDetail.innerHTML =`<article className="card detail">
        <h2>${title}</h2>
        <img src="${images.jpg.image_url}" alt="" />
        <ul>
            ${genres.map(({name})=> {
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
