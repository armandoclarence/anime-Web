const cardDetail = document.querySelector('.card-detail')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const container = document.querySelector('.container-card')
const card = document.querySelector('.cards')

async function getAnimeSchedule(day) {
    const anime = await fetch(`${baseUrl}schedules?filter=${day}`);
    const dayData = await anime.json();
    const { data } = dayData;
    return data;
}

export async function makeScheduleList() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    try {
        for (let i = 0; i < days.length; i++) {
            const result = await getAnimeSchedule(days[i]);
            makeCard(result,days[i])
            console.log(result);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.log(error);
    }
}


export async function getAnimeSeason(){
    const anime = await fetch(`${baseUrl}seasons`)
    const season = await anime.json()
    const {data} = season;
    makeList(data)
    // const {year, seasons} = data
    makeYearList(data)
}

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

export async function getAnimeGenre(){
    const anime = await fetch(`${baseUrl}genres/anime?filter=themes`)
    const genres = await anime.json()
    const {data} = genres; 
    return data
}

export async function getAnimeByGenre(id,page){
    const anime = await fetch(`${baseUrl}anime?genres=${id}&page=${page}`)
    const genres = await anime.json()
    const {data} = genres;
    if(data.length < 25){
        pages.innerHTML = ''
    }
    makeCard(data)
}

export async function getAnimeNow(){
    const anime = await fetch(`${baseUrl}seasons/now`)
    const animeNow = await anime.json()
    console.log(animeNow)
}

getAnimeNow()

export async function getAnimeCompleted(page){
    const anime = await fetch(`${baseUrl}top/anime?sfw=true&page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    makeCard(data)
}

export async function getAnimeByQuery(query,page){
    const anime = await fetch(`${baseUrl}anime?sfw=true&q=${query}&page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    if(data.length < 25){
        pages.innerHTML = ''
    }
    makeCard(data)
}
function makeCard(datas,day){
    day ? card.innerHTML+= ` 
        <h2>${day}</h2>
        <div class="container container-card" value=${day}></div>` :
    container.innerHTML = ''   
    const containers = document.querySelectorAll('.container-card')
    day ? 
    containers.forEach(container => {
        if(container.getAttribute('value') == day){
            datas.map(data => {
                const {title_english,type, episodes, mal_id, images} = data
                container.innerHTML += `
                <article class="card home" id=${mal_id}>
                    <div class="cardHome">
                        <div class="img">
                            <img src="${images.jpg.image_url}"/>
                            <div class="type">${type}</div>
                            <div class="type eps">${episodes}</div>
                        </div>
                        <div class="title">${title_english}</div>
                    </div>
                </article>`
            })
        }
    }) : 
    datas.map(data => {
        const {title,type, episodes, mal_id, images} = data
        container.innerHTML += `
        <article class="card home" id=${mal_id}>
            <div class="cardHome">
                <div class="img">
                    <img src="${images.jpg.image_url}" title="${title}" />
                    <div class="type typeSrc">${type}</div>
                    <div class="type eps">${episodes}</div>
                </div>
                <div class="title">${title}</div>
            </div>
        </article>`
    })
    let cards = document.querySelectorAll('.card')
    cards.forEach(card => {
        card.addEventListener('mouseenter',function(){
            let id = this.getAttribute('id')
            console.log(id)
            let rightCard = this.offsetWidth + this.offsetLeft
            let leftCard = this.offsetWidth
            let topCard = this.offsetTop
            getAnimeDetail(id)
            let cardDetailWidth = cardDetail.offsetWidth || 300
            cardDetail.style.top = `${topCard}px`
            cardDetail.style.left = innerWidth < cardDetailWidth + rightCard 
            ?  
            `${rightCard - cardDetailWidth - leftCard}px` 
            : `${rightCard}px`
            cardDetail.classList.remove('hidden')
        })
        card.addEventListener('mouseleave',function(){
            cardDetail.classList.add('hidden')    
        })
    })
}

async function getAnimeDetail(id){
    const anime = await fetch(`${baseUrl}anime/${id}`)
    const animeData = await anime.json()
    const {data} = animeData
    const {title,aired, title_english, genres,synopsis, score} = data
    const {string} = aired;
    cardDetail.innerHTML =`<article class="card detail">
        <div class="title">
            <h3>${title_english}</h3>
            <h4>${title}</h4>
        </div>
        <section class="animeDetail">
            <div class="info">
            <p>scores: ${score}</p>
            <p class="synopsis">${synopsis}</p>
            <p>Date aired: ${string}</p>
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

