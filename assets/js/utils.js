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
    const { data,meta } = animeData
    return filter != 'filter' ? data: {data,meta}
}

export async function getAnimesByFilter(queryKey,page=0){
    const {types, years, categories, ratings, statusAnime, country, seasons, sorting, keyword} = queryKey
    const url =`${keyword ? `filter[text]=${keyword}&`:''}${types ? `filter[subtype]=${types}&` : ''}${years ? `filter[seasonYear]=${years}&`: ''}${categories ? `filter[categories]=${categories}&`:''}${ratings ? `filter[ageRating]=${ratings}&`: ''}${statusAnime ? `filter[status]=${statusAnime}&`: ''}${seasons? `filter[season]=${seasons}&`: ''}${country? `filter[categories]=${country}&`: ''}${sorting != 'relevance' && sorting!= 'updatedAt' ? `sort=${sorting}&`: ''}page[limit]=20&page[offset]=${page * 20}`
    const animeData = await getAnimeKitsuResponse('anime',url, 'filter')
    let {data,meta} = animeData
    if(sorting == 'updateAt'){
       data = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
    console.log(data)
    const animesByFilter = new AnimeRenderer('.filter-anime')
    await animesByFilter.renderSubCards(data)
    const {count} = meta
    return {count}
}

export function makePagingButton(count){
    console.log(count)
    const baseUrl = new URL(window.location).href;
    console.log(baseUrl)
    const pageContainer = document.querySelector(".pages")
    const buttonCount = Math.ceil(count/20)
    const maxButton = 5
    const page = parseInt(new URL(window.location).searchParams.get('pages')) || 1
    console.log(page)
    if(buttonCount <=maxButton){
        for (let currentPage = 1; currentPage <= buttonCount; currentPage++) {
            console.log(currentPage);
            let newUrl = updateUrlParameter(baseUrl, 'pages', currentPage);
            let listItem = document.createElement('li');
            currentPage == page ? listItem.classList.add('active') : ''
            listItem.innerHTML = currentPage == page ? `<span>${currentPage}</span>` : `<a href="${newUrl}">${currentPage}</a>`;
            pageContainer.appendChild(listItem);
        }
    }else{
        const range = 2;
        const startPage = Math.max(1,page - range);
        const endPage = Math.min(buttonCount ,startPage + 2 * range);
        if(page > 3){
            let newUrl = updateUrlParameter(baseUrl, 'pages', 1);
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-double-left"></i></a>`;
            pageContainer.appendChild(listItem);
            newUrl = updateUrlParameter(baseUrl, 'pages', page - 1);
            listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-left"></i></a>`;
            pageContainer.appendChild(listItem);
        }
        for (let currentPage = `${page < buttonCount - 1 ?startPage: page == buttonCount ? startPage - 2: startPage - 1}`; currentPage <= endPage; currentPage++) {
            console.log(currentPage)
            let newUrl = updateUrlParameter(baseUrl, 'pages', currentPage);

            let listItem = document.createElement('li');
            currentPage == page ? listItem.classList.add('active') : ''
            listItem.innerHTML = currentPage == page ? `<span>${currentPage}</span>` : `<a href="${newUrl}">${currentPage}</a>`;

            pageContainer.appendChild(listItem);
        }
        if(page < buttonCount - 2 ){
            let newUrl = updateUrlParameter(baseUrl, 'pages', page+1);
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-right"></i></a>`;
            pageContainer.appendChild(listItem);
            newUrl = updateUrlParameter(baseUrl, 'pages', buttonCount);
            listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-double-right"></i></a>`;
            pageContainer.appendChild(listItem);
        }
    }
}

function updateUrlParameter(url, key, value) {
    let updatedUrl = new URL(url);
    updatedUrl.searchParams.set(key, value);
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
    await animesByCategory.renderSubCards(animeData)
}

export async function getAnimeByQuery(query,page){
    const animeData = await getAnimeResponse('anime',`sfw=true&q=${query}&page=${page}`)
    pages.children[1].removeAttribute('disabled','')
    if(animeData.length < 25){
        pages.children[1].setAttribute('disabled','')
    }
    const animeByQuery = new AnimeRenderer('.query-anime')
    await animeByQuery.renderSubCards(animeData)
}

export async function getAnimeNow(pageNumber,limit){
    const animeNow = await getAnimeKitsuResponse('anime', `filter[status]=current&page[offset]=${pageNumber * limit}&page[limit]=${limit}`)
    const now = new AnimeRenderer('.now-anime')
    now && await now.renderSubCards(animeNow)
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
        now && await now.renderSubCards(animeNow)
        const animeTop = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime',`filter[status]=current&sort=ratingRank&page[limit]=7`)
            ),500)
        )
        const top = new AnimeRenderer('.top-popularity-anime') 
  await       top.renderSubCards(animeTop)
        console.log(animeTop)
        const animeMostViewed = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime','filter[status]=current&sort=favoritesCount&page[limit]=5')
            ),750)
        )
        const mostViewed = new AnimeRenderer('.most-viewed-anime') 
        await mostViewed.renderSubCards(animeMostViewed)
        const animeCompleted = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime',`filter[status]=finished&page[limit]=7`)
            ),1000)
        )
        const completed = new AnimeRenderer('.completed-anime') 
        await completed.renderSubCards(animeCompleted)
    } catch (error) {
        console.error('Error fetching anime data:', error)
    }
}


async function renderDayCards(datas,day=''){
    cards.innerHTML+= ` 
        <h2>${day}</h2>
        <div class="cards-container ${day}">
        </div>`
    const cardDay = document.querySelector(`.${day}`)
    cardDay.classList.add('now-anime')
    const container = new AnimeRenderer(`.${day}`)
    await container.renderSubCards(datas)
}

export async function getAnimeGenres(){
    let genre = await getAnimeResponse('genres/anime')
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
class AnimeRenderer {
    constructor(containerId) {
        this.container = document.querySelector(containerId)
        if (!this.container) {
            console.error(`Container with id ${containerId} not found.`)
        }
    }

    async renderSubCards(datas) {
        let i = 1
        console.table(datas)
        this.container.innerHTML = (await Promise.all(datas.map(async (data) => await this.renderSubCardHTML(data, i++)))).join('');
        const cards = this.container.querySelectorAll('.card')
        this.renderHoverImg(cards)
    }
    
    renderHoverImg(cards) {
        cards.forEach(async (card) => {
            const cardDetail = card.querySelector('.card-detail');
            let isMouseOverHandled = false;
    
            card.addEventListener('mouseover', async () => {
                if (!isMouseOverHandled) {
                    isMouseOverHandled = true;
    
                    if (cardDetail) {
                        const id = card.getAttribute('id');
                        await this.makeAnimeDetail(id);
    
                        const img = card.children[0].children[0];
                        let rightCard = img.offsetWidth + img.offsetLeft;
                        let leftCard = img.offsetWidth;
                        let cardDetailWidth = 300;
    
                        const innerWidth = window.innerWidth;
    
                        if (innerWidth < cardDetailWidth + rightCard) {
                            cardDetail.style.left = `${rightCard - cardDetailWidth - leftCard}px`;
                            cardDetail.style.marginLeft = '-.5em';
                        } else {
                            cardDetail.style.left = `${rightCard}px`;
                            cardDetail.style.marginLeft = '.5em';
                        }
    
                        cardDetail.classList.remove('hidden');
                    }
                }
            });
    
            card.addEventListener('mouseleave', () => {
                isMouseOverHandled = false;
    
                if (cardDetail) {
                    cardDetail.classList.add('hidden');
                }
            });
        });
    }

    async makeAnimeDetail(id) {
        try {
            const data = await getAnimeDetail(id);
            const { attributes: { subtype, episodeCount, episodeLength, titles, startDate, endDate, synopsis, averageRating } } = data;
            const genres = await getAnimeGenresById(id);
            const genre = genres.map(({ attributes }) => {
                const { name } = attributes;
                return `<li>${name}</li>`;
            });
    
            const categories = await getAnimeCategoriesById(id);
            const category = categories.map(({ attributes }) => {
                const { title } = attributes;
                return `<li>${title}</li>`;
            });
    
            const detailTitle = titles.en || titles.en_jp || titles.en_us || titles.en_cn;
            const detailSubtype = subtype;
    
            const genreHtml = genre === undefined ? genre : category;
            const synopsisHtml = synopsis;
            const averageRatingHtml = (averageRating / 10).toFixed(2);
            const startDateHtml = startDate;
            const endDateHtml = endDate;
            const episodeCountHtml = episodeCount || '';
            const episodeLengthHtml = episodeLength || '';
    
            return {
                detailTitle,
                synopsisHtml,
                averageRatingHtml,
                startDateHtml,
                endDateHtml,
                genreHtml,
                detailSubtype,
                episodeCountHtml,
                episodeLengthHtml,
            };
        } catch (error) {
            console.error("Error fetching anime details:", error);
            return null; // Handle error appropriately
        }
    }
    
    async renderSubCardHTML(data,i) {
        const {attributes: {titles,posterImage},id} = data
        const { detailTitle, synopsisHtml, averageRatingHtml, startDateHtml, endDateHtml, genreHtml, detailSubtype, episodeCountHtml, episodeLengthHtml } = await this.makeAnimeDetail(id);
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
                            ${detailSubtype} ${episodeCountHtml|| ''} ${episodeLengthHtml}
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
                        ${detailSubtype} 
                        <i class="lar la-closed-captioning"></i>${episodeCountHtml}
                        </p>    
                    </div>
                </div>
            </article>`
            :
            `<article class="card" id=${id}>
                <div class="cardHome">
                    <div class="img">
                        <img width="177" height="250" src="${posterImage != null?posterImage.
                        small : 'https://media.kitsu.io/anime/poster_images/6336/small.jpg'}" title="${titles.en || titles.en_jp || titles.en_us || titles.en_cn}" />
                    </div>
                    <div class="title">
                        <h3>
                            ${titles.en || titles.en_jp || titles.en_us || titles.en_cn}
                        </h3>
                    </div>
                </div>
                <div class="card-detail hidden" id="s${id}">
                    <article class="animeDetail">
                        <div class="title">
                            <h3>${detailTitle}</h3>
                            <p>${titles.en || titles.en_jp || titles.en_us || titles.en_cn}</p>
                        </div>
                        <p class="synopsis">${synopsisHtml}</p>
                        <div class="info">
                            <p>Scores: ${averageRatingHtml}</p>
                            <p>Date aired: ${startDateHtml} to ${endDateHtml}</p>
                            <p>Status: ${detailSubtype}</p>
                            <p>Episodes: ${episodeCountHtml} ${episodeLengthHtml}</p>
                            <ul>Genre: ${genreHtml}</ul>
                        </div>
                    </article>
                </div>  
            </article>`
    }
}