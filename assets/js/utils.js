const cardDetail = document.querySelector('.card-detail')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const card = document.querySelector('.cards')

async function getAnimeResponse(typeData, query=""){
    const anime = await fetch(`${baseUrl}${typeData}?${query}`)
    const animeData = await anime.json()
    const { data } = animeData
    return data
}

async function getAnimeSchedule(day) {
    const animeData = await getAnimeResponse('schedules',`filter=${day}`)
    return animeData
}

export async function makeScheduleList() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    try {   
        for (let i = 0; i < days.length; i++) {
            const result = await getAnimeSchedule(days[i])
            renderDayCards(result,days[i])
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getAnimeGenres(){
    const animeData = await getAnimeResponse('genres/anime','filter=themes')
    return animeData
}

export async function getAnimesByGenre(id,page){
    const animeData = await getAnimeResponse('anime',`genres=${id}&page=${page}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 25){
        pages.children[1].setAttribute('disabled','')
    }
    renderSubCards(animeData,'.genreAnimes')
}

export async function getAnimeByQuery(query,page){
    const animeData = await getAnimeResponse('anime',`sfw=true&q=${query}&page=${page}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 25){
        pages.children[1].setAttribute('disabled','')
    }
    renderSubCards(animeData, '.query-anime')
}
let i = 1
class AnimeRenderer {
    constructor(containerId) {
        this.container = document.querySelector(containerId)
        if (!this.container) {
            console.error(`Container with id ${containerId} not found.`)
        }
    }

    renderSubCards(datas) {
        this.container.innerHTML = datas.map(data => this.renderSubCardHTML(data)).join('')
        const cards = this.container.querySelectorAll('.card')
        renderHoverImg(cards)
    }

    renderSubCardHTML(data) {
        const {title_english,title,type, episodes, mal_id, images,duration} = data
        let durations = duration.replace(' per ep', '')
        return  this.container.classList[1] == 'top-popularity-anime' || this.container.classList[1] == 'completed-anime' ?
            `<article class="card sub" id=${mal_id}>
                <div class="cardSub">
                    <div class="img">
                        <img class="image" src="${images.jpg.image_url}" title="${title}" />
                    </div>
                    <div class="title">
                        <h4>
                        ${title_english || title}
                        </h4>
                        <p>
                            ${type} ${episodes} ${durations}
                        </p>
                    </div>
                </div>
            </article>`
        :
        this.container.classList[1] == 'most-viewed-anime' ?
            `<article class="card sub" id=${mal_id}>
                <div class="cardSub most">
                    <div class="type typeSrc">
                        0${i++}
                    </div>
                    <div class="title">
                        <h4>
                        ${title_english || title}
                        </h4>
                        <p>
                        ${type} ${episodes || ''}
                        </p>    
                    </div>
                    <div class="img">
                        <img class="image" src="${images.jpg.image_url}" title="${title}" />
                    </div>
                </div>
            </article>`
            :
            `<article class="card" id=${mal_id}>
                <div class="cardHome">
                    <div class="img">
                        <img src="${images.jpg.image_url}" title="${title}" />
                        <div class="type typeSrc">${type}</div>
                        <div class="type eps">${episodes}</div>
                    </div>
                    <div class="title">${title_english || title}</div>
                </div>
            </article>`
    }
}

export async function getAnimeNows(page) {
    try {
        const animeNow = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeResponse('seasons/now', `page=${page}&limit=14&sfw=true`)
            ),250)
        )
        const animeTop = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeResponse('top/anime',`filter=bypopularity&sfw=true&page=${page}&limit=7`)
            ),500)
        )
        const animeMostViewed = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeResponse('anime', `status=airing&sfw=true&page=${page}&limit=5`)
            ),750)
        )
        const animeCompleted = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeResponse('top/anime',`status=complete&sfw=true&page=${page}&limit=7`)
            ),1000)
        )
        const now = new AnimeRenderer('.now-anime') 
        const top = new AnimeRenderer('.top-popularity-anime') 
        const mostViewed = new AnimeRenderer('.most-viewed-anime') 
        const completed = new AnimeRenderer('.completed-anime') 
        now.renderSubCards(animeNow)
        mostViewed.renderSubCards(animeMostViewed)
        completed.renderSubCards(animeCompleted)
        top.renderSubCards(animeTop)
    } catch (error) {
        console.error('Error fetching anime data:', error)
    }
}

function renderHoverImg(cards){ 
    cards.forEach(card => {
        card.addEventListener('mouseenter',function(){
            let id = this.getAttribute('id')
            console.log(this)
            let rightCard = this.offsetWidth + this.offsetLeft
            let leftCard = this.offsetWidth
            let topCard = this.offsetTop
            getAnimeDetail(id)
            let cardDetailWidth = cardDetail.offsetWidth || 300
            cardDetail.style.top = `${topCard}px`
            cardDetail.style.left = innerWidth < cardDetailWidth + rightCard 
            ?  
            `${rightCard - cardDetailWidth - leftCard}px`  
            : 
            `${rightCard}px`
            cardDetail.style.marginLeft = ''
            cardDetail.style.marginLeft = innerWidth < cardDetailWidth + rightCard 
            ?  
            '-.5em'
            : 
            '.5em'
            cardDetail.classList.remove('hidden')
        })
        card.addEventListener('mouseleave',function(){
            cardDetail.classList.add('hidden')    
        })
    })
}

function renderDayCards(datas,day=''){
    card.innerHTML+= ` 
        <h2>${day}</h2>
        <div class="container">
            <div class="cards-container ${day}"></div>
    </div>`
    const containers = document.querySelectorAll('.cards-container')
    containers.forEach(container => {
        console.log(container)
        renderSubCards(datas, `.${day}`)
    })
}

async function getAnimeDetail(id){
    const anime = await fetch(`${baseUrl}anime/${id}`)
    const animeData = await anime.json()
    const {data} = animeData
    const {status,type,episodes,title,aired, title_english, genres,synopsis, score} = data
    const {string} = aired
    cardDetail.innerHTML =`<article class="card detail">
        <div class="type typeSrc">${type}</div>
        <section class="animeDetail">
            <div class="title">
                <h3>${title_english || title}</h3>
                <h4>${title}</h4>
            </div>
            <div class="info">
                <p class="synopsis">${synopsis}</p>
                <p>Scores: ${score}</p>
                <p>Date aired: ${string}</p>
                <p>Status: ${status}</p>
                <ul>
                    Genre:${genres.map(({name})=> {
                        return `<li>${name}</li>`  
                    })}
                </ul>
            </div>
        </section>
    </article>`
}

