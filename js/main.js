
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://anime-api.cyclic.cloud/"
let pages = 1
const container = document.querySelector('.container-card')

window.addEventListener('load',function(e){
    getAnime(pages)
})

const prevButton = document.querySelector('.prev')
const nextButton = document.querySelector('.next')

prevButton.addEventListener('click',function(e){
    pages--
    if(pages == 1) this.setAttribute('disabled', '')
    getAnime(pages)
})

nextButton.addEventListener('click',function(e){
    pages++ 
    prevButton.removeAttribute('disabled', '')
    getAnime(pages)
})

async function getAnime(page = 1){
    const anime = await fetch(`${baseUrl}complete-anime?page=${page}`)
    const animeData = await anime.json()
    const {collection} = animeData;
    const {data} = collection;
    makeCard(data)
}


function makeCard(datas){
    container.innerHTML = ''
    datas.map(data => {
        const {title, thumbnail, slug, rating, releaseDate, status} = data
        container.innerHTML += `
        <article class="card home" value=${slug}>
            <img src="${thumbnail}" alt="${slug}" />
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

