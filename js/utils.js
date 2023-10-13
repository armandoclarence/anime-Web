
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

    // const anime = await fetch(`${basebaseUrl}complete-anime?page=${page}`)
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
    cards.forEach(card => card.addEventListener('click',function(){
        let slug = this.getAttribute('value')
        getAnimeDetail(slug)
        modal.showModal()
    }))
}

async function getAnimeDetail(slug){
    const anime = await fetch(`${baseUrl}anime/${slug}`)
    const animeData = await anime.json()
    const {title, thumbnail, genres, score,episodeLists} = animeData
    let episodeList = episodeLists.map(episodeList => {
            const { slug } = episodeList
            return slug
        })
    episodeList.shift(episodeList[0])
    episodeList.pop(episodeList[episodeList.length - 1])
    let episodeNumber = episodeList.map(episode => {
        let episodeNum = episode.replace(/(\D+-|\D+.)/g, "")
        return { episode, episodeNum}
    })
    cardDetail.innerHTML =`<article class="card detail">
        <h2>${title}</h2>
        <img src="${thumbnail}" alt="" />
        <ul>
            ${genres.map(genre => {
                return `<li>${genre}</li>`  
            })}
        </ul>
        <p>rating: ${score}</p>
        <ul>
            ${episodeNumber.map(({episode, episodeNum}) => {
                    if(episode === 'maogkn-ftkg-s2-episode8-sub-indo') episodeNum = 8
                    return `
                        <li>
                            <button data-value="${episode}" number="${episodeNum}">
                            </button>
                        </li>
                    `
                }).join('')
            }
        </ul>
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
