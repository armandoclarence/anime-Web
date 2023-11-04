const cardDetail = document.querySelector('.card-detail')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const container = document.querySelector('.cards-container.now-anime')
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
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    try {   
        for (let i = 0; i < days.length; i++) {
            const result = await getAnimeSchedule(days[i])
            renderCards(result,days[i])
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getAnimeRecommendation(){
    const animeData = await getAnimeResponse('recommendations/anime')

}

// export async function getAnimeSeason(){
    // const animeSeason = await getAnimeResponse('seasons')
    // const anime = await fetch(`${baseUrl}seasons`)
    // const season = await anime.json()
    // const {data} = season;
    // makeList(data)
    // const {year, seasons} = data
    // makeYearList(data)
// }

function makeYearList(datas){
    const years = document.querySelector('.years .list')
    datas.map(({year})=>{
        years.innerHTML += `<li>${year}</li>`
        // console.log(year)
    })

}

function makeList(data){
    data.map(({year, seasons}) => {
        console.log(year)
    })

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
    renderCards(animeData)
}

export async function getAnimeNow(page){
    const animeData = await getAnimeResponse('seasons/now',`page=${page}&limit=14&sfw=true`)
    renderSubCards(animeData, '.now-anime')
}
export async function getAnimeTop(page){
    const animeData = await getAnimeResponse('top/anime',`filter=bypopularity&sfw=true&page=${page}&limit=7`)
    renderSubCards(animeData, '.top-popularity-anime')
}

export async function getAnimeByQuery(query,page){
    const animeData = await getAnimeResponse('anime',`sfw=true&q=${query}&page=${page}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 25){
        pages.children[1].setAttribute('disabled','')
    }
    renderSubCards(animeData, '.query-anime')
}


function renderSubCards(datas, containerId) {
    let container = document.querySelector(`${containerId}`);
    container.innerHTML = datas.map(data => renderSubCardHTML(data,containerId)).join('');
    let cards = document.querySelectorAll('.card')
    renderHoverImg(cards)
}

function renderSubCardHTML(data,containerId) {
    console.log(containerId)
    const {title_english,title,type, episodes, mal_id, images} = data
    return  containerId != '.query-anime' && containerId != '.now-anime' ?
    `<article class="card home" id=${mal_id}>
        <div class="cardHome">
            <div class="img">
                <img class="" src="${images.jpg.image_url}" title="${title}" />
            </div>
        </div>
    </article>`
    :
    `<article class="card home" id=${mal_id}>
        <div class="cardHome">
            <div class="img">
                <img src="${images.jpg.image_url}" title="${title}" />
                <div class="type typeSrc">${type}</div>
                <div class="type eps">${episodes}</div>
            </div>
            <div class="title">${title || title_english}</div>
        </div>
    </article>`
}

function renderHoverImg(cards){ 
    cards.forEach(card => {
        card.addEventListener('mouseenter',function(){
            let id = this.getAttribute('id')
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

function renderCards(datas,day=''){
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
    const {string} = aired;
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
                    Genre: 
                    ${genres.map(({name})=> {
                        return `<li>${name}</li>`  
                    })}
                </ul>
            </div>
        </section>
    </article>`
}

