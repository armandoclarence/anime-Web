const cardDetail = document.querySelector('.card-detail')
const baseUrl = "https://api.jikan.moe/v4/"
const kitsuApi = "https://kitsu.io/api/edge/";
const pages = document.querySelector('.page')
const card = document.querySelector('.cards')

export async function getAnimeResponse(typeData, query=""){
    const anime = await fetch(`${baseUrl}${typeData}?${query}`)
    const animeData = await anime.json()
    const { data } = animeData
    return data
}

export async function getAnimeKitsuResponse(typeData, query=""){
    const anime = await fetch(`${kitsuApi}${typeData}?${query}`)
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
            await new Promise(resolve => setTimeout(resolve, 2000))
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
    const animesByGenre = new AnimeRenderer('.genreAnimes')
    animesByGenre.renderSubCards(animeData)
}

export async function getAnimeByQuery(query,page){
    const animeData = await getAnimeResponse('anime',`sfw=true&q=${query}&page=${page}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 25){
        pages.children[1].setAttribute('disabled','')
    }
    const animeByQuery = new AnimeRenderer('.query-anime')
    animeByQuery.renderSubCards(animeData)
}

export async function getAnimeNow(pageNumber,limit){
    const animeNow = await getAnimeKitsuResponse('anime', `filter[status]=current&page[offset]=${pageNumber * limit}&page[limit]=${limit}`)
    return animeNow
} 

export async function getAnimeNows() {
    try {
        const animeNow = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeNow(0,14)
            ),250)
        )
        const now = new AnimeRenderer('.now-anime')
        now && now.renderSubCards(animeNow)
        const animeTop = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime',`sort=popularityRank&page[limit]=7`)
            ),500)
        )
        console.log(animeTop)
        const top = new AnimeRenderer('.top-popularity-anime') 
        top.renderSubCards(animeTop)
        const animeMostViewed = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime','sort=userCount&page[limit]=5')
            ),750)
        )
        console.log(animeMostViewed)
        const mostViewed = new AnimeRenderer('.most-viewed-anime') 
        mostViewed.renderSubCards(animeMostViewed)
        const animeCompleted = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime',`filter[status]=finished&page[limit]=7`)
            ),1000)
        )
        const completed = new AnimeRenderer('.completed-anime') 
        completed.renderSubCards(animeCompleted)
    } catch (error) {
        console.error('Error fetching anime data:', error)
    }
}

function renderHoverImg(cards){ 
    cards.forEach(card => {
        if(window.innerWidth < 1000) return
        let id = card.getAttribute('id')
        const img = card.children[0].children[0]
        img.addEventListener('mouseover',function(){
            let rightCard = this.offsetWidth + this.offsetLeft
            let leftCard = this.offsetWidth
            let topCard = this.offsetTop
            getAnimeDetail(id)
            let cardDetailWidth = cardDetail.offsetWidth || 300
            cardDetail.style.top = `${topCard + 50}px`
            cardDetail.style.left = 
            innerWidth < cardDetailWidth + rightCard 
            ? `${rightCard - cardDetailWidth - leftCard}px`  
            : `${rightCard}px`
            cardDetail.style.marginLeft = 
            innerWidth < cardDetailWidth + rightCard 
            ?  '-.5em'
            : '.5em'
            cardDetail.classList.remove('hidden')
        })
        img.addEventListener('mouseleave',function(){
            cardDetail.classList.add('hidden')
        })
    })
}

function renderDayCards(datas,day=''){
    card.innerHTML+= ` 
        <h2>${day}</h2>
        <div class="cards-container ${day}">
        </div>`
    const cardDay = document.querySelector(`.${day}`)
    cardDay.classList.add('now-anime')
    const container = new AnimeRenderer(`.${day}`)
    container.renderSubCards(datas)
}

async function getAnimeDetail(id){
    const anime = await fetch(`${kitsuApi}anime/${id}`)
    const animeData = await anime.json()
    const {data} = animeData
    const {attributes} = data
    const {subtype,episodeCount,titles, startDate, genres,synopsis, averageRating} = attributes
    cardDetail.innerHTML =`
        <article class="animeDetail">
            <div class="title">
                <h3>${titles.en || titles.en_jp}</h3>
                <p>${titles.en}</p>
            </div>
            <p class="synopsis">${synopsis}</p>
            <div class="info">
                <p>Scores: ${averageRating / 100}</p>
                <p>Date aired: ${startDate}</p>
                <p>Status: ${subtype}</p>
                <ul>
                    Genre:${genres.map(({name})=> {
                        return `<li>${name}</li>`  
                    })}
                </ul>
            </div>
        </article>
    `
}

class AnimeRenderer {
    constructor(containerId) {
        this.container = document.querySelector(containerId)
        console.log(this.container)
        if (!this.container) {
            console.error(`Container with id ${containerId} not found.`)
        }
    }

    renderSubCards(datas) {
        let i = 1
        this.container.innerHTML = datas.map(data => this.renderSubCardHTML(data,i++)).join('')
        const cards = this.container.querySelectorAll('.card')
        renderHoverImg(cards)
    }
    renderSubCardHTML(data,i) {
        console.log(data)
        const {attributes,id} = data
        console.log(attributes)
        const {titles,subtype,coverImage,posterImage,episodeCount,episodeLength}  = attributes
        console.log(coverImage)
        return  this.container.classList[0] == 'top-popularity-anime' || this.container.classList[0] == 'completed-anime' ?
            `<article class="card sub" id=${id}>
                <div class="cardSub">
                    <img class="image" src="${posterImage.small}" title="${titles.en}" />
                    <div class="title">
                        <h4>
                        ${titles.en || titles.en_jp}
                        </h4>
                        <p>
                            ${subtype} ${episodeCount|| ''} ${episodeLength}
                        </p>
                    </div>
                </div>
            </article>`
        :
        this.container.classList[0] == 'most-viewed-anime' ?
            `<article class="card sub mosts" id=${id}>
                <div class="cardSub most ${i == 1 ? 'big' : ''}">
                    <div class="imgs">
                        <img class="image" src="${coverImage.original || posterImage.original}" title="${titles.en}" />
                    </div>
                    ${i == 1 ? `
                    <h3>MOST VIEWED</h3>
                    <h2>0${i}</h2>
                    ` : ''
                    }
                    <div class="title">
                        <h4>
                        ${i == 1 ? titles.en : titles.end_jp}
                        </h4>
                        <p>
                        ${subtype} 
                        <i class="lar la-closed-captioning"></i>${episodeCount || ''}
                        </p>    
                    </div>
                </div>
            </article>`
            :
            `<article class="card" id=${id}>
                <div class="cardHome">
                    <div class="img">
                        <img src="${posterImage.small}" title="${titles.en}" />
                    </div>
                    <div class="title">
                        <h4>
                            ${titles.en || titles.en_jp}
                        </h4>
                    </div>
                </div>
            </article>`
    }
}