const cardsDetail = document.querySelector('.cards-detail')
const baseUrl = "https://api.jikan.moe/v4/"
const kitsuApi = "https://kitsu.io/api/edge/";
const pages = document.querySelector('.page')
const cards = document.querySelector('.cards')

export async function getAnimeResponse(typeData, query=""){
    const anime = await fetch(`${baseUrl}${typeData}?${query}`)
    const animeData = await anime.json()
    const { data } = animeData
    return data
}

export async function getAnimeKitsuResponse(typeData, query="", filter=""){
    const anime = await fetch(`${kitsuApi}${typeData}?${query}`)
    const animeData = await anime.json()
    const { data,links,meta } = animeData
    return filter != 'filter' ? data: {data,links,meta}
}

export async function getAnimesByFilter(queryKey,page=0){
    const {types, years, categories, ratings, statusAnime, country, seasons, sorting, keyword} = queryKey
    const url =`${keyword ? `filter[text]=${keyword}&`:''}${types ? `filter[subtype]=${types}&` : ''}${years ? `filter[seasonYear]=${years}&`: ''}${categories ? `filter[categories]=${categories}&`:''}${ratings ? `filter[ageRating]=${ratings}&`: ''}${statusAnime ? `filter[status]=${statusAnime}&`: ''}${seasons? `filter[season]=${seasons}&`: ''}${country? `filter[categories]=${country}&`: ''}${sorting != 'relevance' && sorting!= 'updatedAt' ? `sort=${sorting}&`: ''}page[limit]=20&page[offset]=${page * 20}`
    const animeData = await getAnimeKitsuResponse('anime',url, 'filter')
    let {data,links,meta} = animeData
    if(sorting == 'updateAt'){
       data = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
    console.log(data)
    const animesByFilter = new AnimeRenderer('.filter-anime')
    animesByFilter.renderSubCards(data)
    const {count} = meta
    return {count,links}
}

export function makePagingButton(filter,count){
    const baseUrl = 'http://127.0.0.1:5500/filter.html';
    const pageContainer = document.querySelector(".pages")
    const buttonCount = Math.ceil(count/20)
    const filterObj = Object.keys(filter).map(key =>[key,filter[key]])
    let filters =filterObj.filter(filt=> filt[1]!=='' && filt[1].length>0)
    let newObj = {};
    filters.map((v)=>{
        let key = v[0]
        let value = v[1]
        newObj[key] = value
    })
    console.log(buttonCount)
    console.log(baseUrl)
    const maxButton = 5
    console.log(pageContainer)
    console.log(window.location)
    console.log(window)
    const page = new URL(window.location).searchParams.get('pages')
    console.log(page)
    if(buttonCount <maxButton){
        for(let pages=1;pages<=5;pages++){
            let newUrl = updateUrlParameter(baseUrl, newObj, 'pages', pages);
    
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}">${pages}</a>`;
    
            pageContainer.appendChild(listItem)
        }
    }else{
        const range = 2;
        const startPage = Math.max(1, page - range);
        const endPage = startPage + 2 * range;
        for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
            console.log(currentPage);
            let newUrl = updateUrlParameter(baseUrl, newObj, 'pages', currentPage);

            let listItem = document.createElement('li');
            currentPage == page ? listItem.classList.add('active') : ''
            listItem.innerHTML = currentPage == page ? `<span>${currentPage}</span>` : `<a href="${newUrl}">${currentPage}</a>`;

            pageContainer.appendChild(listItem);
        }


        // pageContainer.innerHTML += `
        //     <li class="page-item">
        //         <a rel="next"><i class="las la-angle-right"></i></a>
        //     </li>
        // `
        // pageContainer.innerHTML += `
        //     <li class="page-item">
        //         <a rel="last"><i class="las la-angle-double-right"></i></a>
        //     </li>
        // `
    }
}

function updateUrlParameter(url, Obj, key, value) {
    console.log(Obj)
    let updatedUrl = new URL(url);
    updatedUrl.searchParams.set(key, value);
    for(const key in Obj){
        updatedUrl.searchParams.set(key, Obj[key]);
    }
    return updatedUrl.href;
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

export async function getAnimesByCategory(genre,pageNumber){
    console.log(pageNumber)
    const animeData = await getAnimeKitsuResponse('anime',`filter[categories]=${genre}&page[limit]=20&page[offset]=${20 * pageNumber}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 20){
        pages.children[1].setAttribute('disabled','')
    }
    const animesByCategory = new AnimeRenderer('.categoryAnimes')
    animesByCategory.renderSubCards(animeData)
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

function renderHoverImg(cards){ 
    if(window.innerWidth < 1000) return
    cards.forEach(card => {
        let id = card.getAttribute('id')
        const img = card.children[0].children[0]
        const cardDetail = document.getElementById(`s${id}`) || ''
        // console.log(cardDetail)
        img.addEventListener('mouseover',async function(){
            let rightCard = this.offsetWidth + this.offsetLeft
            let leftCard = this.offsetWidth
            let topCard = this.offsetTop
            // if(cardDetail == '') await makeAnimeDetail(id)
            // console.log(cardDetail)
            // let cardDetailWidth = cardDetail.offsetWidth || 300
            // cardDetail.style.top = `${topCard + 50}px`
            // cardDetail.style.left = 
            // innerWidth < cardDetailWidth + rightCard 
            // ? `${rightCard - cardDetailWidth - leftCard}px`  
            // : `${rightCard}px`
            // cardDetail.style.marginLeft = 
            // innerWidth < cardDetailWidth + rightCard 
            // ?  '-.5em'
            // : '.5em'
            // cardDetail.classList.remove('hidden')
        })
        // cardDetail.addEventListener('mouseleave',function(){
        //     cardDetail.classList.add('hidden')
        // })
    })
}


export async function getAnimeNow(pageNumber,limit){
    const animeNow = await getAnimeKitsuResponse('anime', `filter[status]=current&page[offset]=${pageNumber * limit}&page[limit]=${limit}`)
    const now = new AnimeRenderer('.now-anime')
    now && now.renderSubCards(animeNow)
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
                getAnimeKitsuResponse('anime',`filter[status]=current&sort=ratingRank&page[limit]=7`)
            ),500)
        )
        const top = new AnimeRenderer('.top-popularity-anime') 
        top.renderSubCards(animeTop)
        console.log(animeTop)
        const animeMostViewed = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime','filter[status]=current&sort=favoritesCount&page[limit]=5')
            ),750)
        )
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


function renderDayCards(datas,day=''){
    cards.innerHTML+= ` 
        <h2>${day}</h2>
        <div class="cards-container ${day}">
        </div>`
    const cardDay = document.querySelector(`.${day}`)
    cardDay.classList.add('now-anime')
    const container = new AnimeRenderer(`.${day}`)
    container.renderSubCards(datas)
}

export async function getAnimeGenres(){
    let genre = await getAnimeResponse('genres/anime')
    console.log(genre)
    genre = genre.filter(({mal_id})=>{
        return mal_id==1 || mal_id==2 || mal_id==4 || mal_id==5 || mal_id>=7 && mal_id<=10 || mal_id==14 || mal_id==15 || mal_id >=17 && mal_id<=20 || mal_id>=22 && mal_id<=32 || mal_id>=35 && mal_id<=38 || mal_id>=40 && mal_id<=43 || mal_id==47 || mal_id==62 || mal_id==63 || mal_id==66 || mal_id==73
    })
    return genre
}

async function getAnimeGenresById(id){
    const genres = await getAnimeKitsuResponse(`anime/${id}/genres`)
    return genres
}

async function getAnimeCategoriesById(id){
    const categories = await getAnimeKitsuResponse(`anime/${id}/categories`)
    return categories
}

async function getAnimeDetail(id){
    const anime = await getAnimeKitsuResponse(`anime/${id}`)
    return anime
}

async function makeAnimeDetail(id){
    const data = await getAnimeDetail(id)
    const {attributes:{subtype,episodeCount, titles, startDate, endDate, synopsis, averageRating}} = data
    const genres = await getAnimeGenresById(id);
    const genre = genres.map(({attributes})=>{
        const {name} = attributes
        return `<li>${name}</li>`
    })
    console.log(genre)
    const categories = await getAnimeCategoriesById(id);
    const category = categories.map(({attributes})=>{
        const {title} = attributes
        return `<li>${title}</li>`
    })
    cardsDetail.innerHTML +=`
        <div class="card-detail" id="s${id}">
            <article class="animeDetail">
                <div class="title">
                    <h3>${titles.en || titles.en_jp || titles.en_us || titles.en_cn}</h3>
                    <p>${titles.en || titles.en_jp || titles.en_us || titles.en_cn}</p>
                </div>
                <p class="synopsis">${synopsis}</p>
                <div class="info">
                    <p>Scores: ${(averageRating / 10).toFixed(2)}</p>
                    <p>Date aired: ${startDate} to ${endDate}</p>
                    <p>Status: ${subtype}</p>
                    <ul>
                    Genre: ${genre==undefined ?genre : category}
                    </ul>
                </div>
            </article>
        </div>
            `
}

class AnimeRenderer {
    constructor(containerId) {
        this.container = document.querySelector(containerId)
        if (!this.container) {
            console.error(`Container with id ${containerId} not found.`)
        }
    }

    renderSubCards(datas) {
        let i = 1
        console.log(datas)
        this.container.innerHTML = datas.map(data => this.renderSubCardHTML(data,i++)).join('')
        const cards = this.container.querySelectorAll('.card')
        renderHoverImg(cards)
    }
    renderSubCardHTML(data,i) {
        const {attributes: {titles,subtype,coverImage,posterImage,episodeCount,episodeLength},id} = data
        return  this.container.classList[0] == 'top-popularity-anime' || this.container.classList[0] == 'completed-anime' ?
            `<article class="card sub" id=${id}>
                <div class="cardSub">
                    <img width="60" height="85" class="image" src="${posterImage.
                    tiny}" title="${titles.en || titles.en_jp || titles.en_us || titles.en_cn}" />
                    <div class="title">
                        <h4>
                        ${titles.en || titles.en_jp || titles.en_us || titles.en_cn}
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
                        <img width="60" height="${i == 1?"200":"85"}" class="image" src="${i==1 ?posterImage.small : posterImage.
                        tiny}" title="${titles.en || titles.en_jp || titles.en_us || titles.en_cn}" />
                    </div>
                    ${i == 1 ? `
                    <h2>MOST VIEWED</h2>
                    <h3>0${i}</h3>
                    ` : ''
                    }
                    <div class="title">
                        <h4>
                        ${titles.en || titles.en_jp || titles.en_us || titles.en_cn}
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
                        <img width="177" height="250" src="${posterImage.
                        small}" title="${titles.en || titles.en_jp || titles.en_us || titles.en_cn}" />
                    </div>
                    <div class="title">
                        <h3>
                            ${titles.en || titles.en_jp || titles.en_us || titles.en_cn}
                        </h3>
                    </div>
                </div>
            </article>`
    }
}