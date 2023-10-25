const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const container = document.querySelector('.container')
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
    const anime = await fetch(`${baseUrl}genres/anime`)
    const genres = await anime.json()
    const {data} = genres;
    return data
}

export async function getAnimeByGenre(id,page){
    const anime = await fetch(`${baseUrl}anime?genres=${id}&page=${page}`)
    const genres = await anime.json()
    const {data} = genres;
    makeCard(data)
}

export async function getAnimeCompleted(page){
    const anime = await fetch(`${baseUrl}top/anime?page=${page}`)
    const animeData = await anime.json()
    const {data} = animeData;
    makeCard(data)
}

export async function getAnimeByQuery(query,page){
    const anime = await fetch(`${baseUrl}anime?q=${query}&page=${page}`)
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
                const {title,type, episodes, mal_id, images} = data
                container.innerHTML += `
                <article class="card home" id=${mal_id}>
                    <div class="cardHome">
                        <div class="img">
                            <img src="${images.jpg.image_url}" title="${title}" />
                            <div class="type">${type}</div>
                            <div class="type eps">${episodes}</div>
                        </div>
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
        card.addEventListener('click',function(){
            let id = this.getAttribute('id')
            console.log(id)
            getAnimeDetail(id)
            modal.showModal()
        })
    })
}

async function getAnimeDetail(id){
    const anime = await fetch(`${baseUrl}anime/${id}`)
    const animeData = await anime.json()
    const {data} = animeData
    const {title, images, genres, score,duration,rating} = data
    cardDetail.innerHTML =`<article class="card detail">
        <h2>${title}</h2>
        <section class="animeDetail">
            <div class="img">
                <img src="${images.jpg.image_url}"/>
            </div>
            <div class="info">
                <ul>
                    Genres: 
                    ${genres.map(({name})=> {
                        return `<li>${name}</li>`  
                    })}
                </ul>
                <p>rate: ${score}</p>
                <p>duration: ${duration}</p>
                <p>rating: ${rating}</p>
            </div>
        </section>
        <input id="backButton" type="button" value="Kembali" />
    </article>`
    const backButton = document.querySelector('#backButton')
    backButton.addEventListener('click',function(){
        modal.close()
    })
}

