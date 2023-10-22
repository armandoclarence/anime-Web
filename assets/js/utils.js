
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://api.jikan.moe/v4/"
const pages = document.querySelector('.page')
const container = document.querySelector('.container')

const cache = {};

export async function getAnimeSchedule(day) {
    const anime = await fetch(`${baseUrl}schedules?filter=${day}`);
    const dayData = await anime.json();
    const { data } = dayData;
    return data;
}

export async function makeDayList() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    try {
        for (let i = 0; i < days.length; i++) {
            const result = await getAnimeSchedule(days[i]);
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
        console.log(year)
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
    makeCard(data)
}
function makeCard(datas){
    console.log(datas)    
    // container.innerHTML = '' 
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
    const {title, images, genres, score, background} = data
    cardDetail.innerHTML =`<article class="card detail">
        <h2>${title}</h2>
        <img src="${images.jpg.image_url}" alt="" />
        <p>Synopsis: ${background}</p>
        <ul>
            ${genres.map(({name})=> {
                return `<li>${name}</li>`  
            })}
        </ul>
        <p>rating: ${score}</p>
        <input id="backButton" type="button" value="Kembali" />
    </article>`
    const backButton = document.querySelector('#backButton')
    backButton.addEventListener('click',function(){
        modal.close()
    })
}

