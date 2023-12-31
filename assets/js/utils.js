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
    const url =`${keyword ? `filter[text]=${keyword}&`:''}${types ? `filter[subtype]=${types}&` : ''}${years ? `filter[seasonYear]=${years}&`: ''}${categories ? `filter[categories]=${categories}&`:''}${ratings ? `filter[ageRating]=${ratings}&`: ''}${statusAnime ? `filter[status]=${statusAnime}&`: ''}${seasons? `filter[season]=${seasons}&`: ''}${country? `filter[categories]=${country}&`: ''}${sorting != 'relevance' && sorting!= 'updatedAt' ? `sort=${sorting}&`: ''}page[limit]=20&page[offset]=${page * 20}&fields[anime]=id`
    const animeData = await getAnimeKitsuResponse('anime',url, 'filter')
    let {data,meta} = animeData
    if(sorting == 'updateAt'){
       data = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
    const animesByFilter = new AnimeRenderer('.filter-anime')
    await animesByFilter.renderSubCards(data)
    const {count} = meta
    return {count}
}

export function makePagingButton(count){
    const searchParams = new URL(window.location).href;
    const pageContainer = document.querySelector(".pages")
    const buttonCount = Math.ceil(count/20)
    const maxButton = 5
    const page = parseInt(new URL(window.location).searchParams.get('pages')) || 1
    if(buttonCount <=maxButton){
        for (let currentPage = 1; currentPage <= buttonCount; currentPage++) {
            let newUrl = updateUrlParameter(searchParams, 'pages', currentPage);
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
            let newUrl = updateUrlParameter(searchParams, 'pages', 1);
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-double-left"></i></a>`;
            pageContainer.appendChild(listItem);
            newUrl = updateUrlParameter(searchParams, 'pages', page - 1);
            listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-left"></i></a>`;
            pageContainer.appendChild(listItem);
        }
        for (let currentPage = `${page < buttonCount - 1 ?startPage: page == buttonCount ? startPage - 2: startPage - 1}`; currentPage <= endPage; currentPage++) {
            let newUrl = updateUrlParameter(searchParams, 'pages', currentPage);

            let listItem = document.createElement('li');
            currentPage == page ? listItem.classList.add('active') : ''
            listItem.innerHTML = currentPage == page ? `<span>${currentPage}</span>` : `<a href="${newUrl}">${currentPage}</a>`;

            pageContainer.appendChild(listItem);
        }
        if(page < buttonCount - 2 ){
            let newUrl = updateUrlParameter(searchParams, 'pages', page+1);
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-right"></i></a>`;
            pageContainer.appendChild(listItem);
            newUrl = updateUrlParameter(searchParams, 'pages', buttonCount);
            listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newUrl}"><i class="las la-xs la-angle-double-right"></i></a>`;
            pageContainer.appendChild(listItem);
        }
    }
}

function updateUrlParameter(updatedUrl, key, value) {
    updatedUrl = new URL(updatedUrl)
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
    const animeNow = await getAnimeKitsuResponse('anime', `fields[anime]=id&filter[status]=current&page[offset]=${pageNumber * limit}&page[limit]=${limit}`)
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
                getAnimeKitsuResponse('anime',`fields[anime]=id&filter[status]=current&sort=ratingRank&page[limit]=7`)
            ),500)
        )
        const top = new AnimeRenderer('.top-popularity-anime') 
        await top.renderSubCards(animeTop)
        const animeMostViewed = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime','fields[anime]=id&filter[status]=current&sort=favoritesCount&page[limit]=5')
            ),750)
        )
        const mostViewed = new AnimeRenderer('.most-viewed-anime') 
        await mostViewed.renderSubCards(animeMostViewed)
        const animeCompleted = await new Promise(
            resolve => 
            setTimeout(()=>resolve(
                getAnimeKitsuResponse('anime',`fields[anime]=id&filter[status]=finished&page[limit]=7`)
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
        this.container.innerHTML = (await Promise.all(datas.map(async ({id}) => await this.renderSubCardHTML(id, i++)))).join('');
        const cards = this.container.querySelectorAll('.card')
        this.renderHoverImg(cards)
    }
    
    renderHoverImg(cards) {
        cards.forEach((card) => {
            const cardDetail = card.querySelector('.card-detail');
            const img = card.children[0].children[0]
            img.addEventListener('mouseenter', () => {
                if (cardDetail) {
                    let cardRect = card.getBoundingClientRect();
                    let imgRect = img.children[0].getBoundingClientRect();
                    if(cardRect.right + imgRect.width > card.parentNode.offsetWidth){
                        card.classList[2] ? 
                         cardDetail.style.left =`${cardRect.width}px`
                        :
                        card.classList[1] ?
                        cardDetail.style.left = `${imgRect.width}px`
                        :
                        cardDetail.style.right = `${imgRect.width + 8}px`

                    }else{
                        card.classList[2] ? 
                         cardDetail.style.left =`${cardRect.width}px`
                        :
                        cardDetail.style.left = `${imgRect.width}px` 
                    }
                    cardDetail.style.marginLeft = '.5em'
                    cardDetail.style.top = '1.5em'
                    cardDetail.classList.remove('hidden');
                }
            });
            card.addEventListener('mouseleave', () => {
                if (cardDetail) {
                    cardDetail.classList.add('hidden');
                }
            });
        });
    }

    async makeAnimeDetail(id) {
        try {
            const data = await getAnimeDetail(id);
            const { attributes: { status, subtype,posterImage, episodeCount, episodeLength, titles, startDate, endDate, synopsis, averageRating } } = data;
            const genres = await getAnimeGenresById(id);
            const genre = genres.map(({ attributes : {name} }) => {
                return `<li>${name}</li>`;
            });
    
            const categories = await getAnimeCategoriesById(id);
            const category = categories.map(({ attributes : {title} }) => {
                return `<li>${title}</li>`;
            });
    
            const detailTitle = titles.en || titles.en_jp || titles.en_us || titles.en_cn;
            const detailSubtype = subtype;
    
            const genreHtml = genre === undefined ? genre : category;
            const synopsisHtml = synopsis || '...';
            const averageRatingHtml = (averageRating / 10).toFixed(2);
            const startDateHtml = startDate;
            const endDateHtml = endDate || '?';
            const episodeCountHtml = episodeCount || '';
            const episodeLengthHtml = episodeLength || '';
            return {
                detailTitle,
                synopsisHtml,
                averageRatingHtml,
                startDateHtml,
                endDateHtml,
                status,
                posterImage,
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
    
    async renderSubCardHTML(id,i) {
        const {posterImage, detailTitle,status, synopsisHtml, averageRatingHtml, startDateHtml, endDateHtml, genreHtml, detailSubtype, episodeCountHtml, episodeLengthHtml } = await this.makeAnimeDetail(id);
        return  this.container.classList[0] == 'top-popularity-anime' || this.container.classList[0] == 'completed-anime' ?
            `<article class="card sub" id=${id}>
                <div class="cardSub">
                    <div class="imgs">
                        <img class="image" src="${posterImage.
                        tiny}" title="${detailTitle}" />
                    </div>
                    <div class="title">
                        <h4>
                        ${detailTitle}
                        </h4>
                        <p>
                            ${detailSubtype} ${episodeCountHtml|| ''} ${episodeLengthHtml}
                        </p>
                    </div>
                </div>
                <div class="card-detail hidden" id="s${id}">
                    <article class="animeDetail">
                        <div class="title">
                            <h3>${detailTitle}</h3>
                            <p>${detailTitle}</p>
                        </div>
                        <p class="synopsis">${synopsisHtml}</p>
                        <div class="info">
                            <p>Scores: ${averageRatingHtml}</p>
                            <p>Date aired: ${startDateHtml} to ${endDateHtml}</p>
                            <p>Status: ${status}</p>
                            <p>Episodes: ${episodeCountHtml} ${episodeLengthHtml}</p>
                            <ul>Genre: ${genreHtml}</ul>
                        </div>
                    </article>
                </div>  
            </article>`
        :
        this.container.classList[0] == 'most-viewed-anime' ?
            `<article class="card sub mosts" id=${id}>
                <div class="cardSub most ${i == 1 ? 'big' : ''}">
                    <div class="imgs">
                        <img class="image" src="${i==1 ?posterImage.small : posterImage.
                        tiny}" title="${detailTitle}" />
                    </div>
                    ${i == 1 ? `
                    <h2>MOST VIEWED</h2>
                    <h3>0${i}</h3>
                    ` : ''
                    }
                    <div class="title">
                        <h4>
                        ${detailTitle}
                        </h4>
                        <p>
                        ${detailSubtype} 
                        <i class="lar la-closed-captioning"></i>${episodeCountHtml}
                        </p>    
                    </div>
                </div>
                <div class="card-detail hidden" id="s${id}">
                    <article class="animeDetail">
                        <div class="title">
                            <h3>${detailTitle}</h3>
                            <p>${detailTitle}</p>
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
            :
            `<article class="card" id=${id}>
                <div class="cardHome">
                    <div class="img">
                        <img src="${posterImage != null?posterImage.
                        small : 'https://media.kitsu.io/anime/poster_images/6336/small.jpg'}" title="${detailTitle}" />
                    </div>
                    <div class="title">
                        <h3>
                            ${detailTitle}
                        </h3>
                    </div>
                </div>
                <div class="card-detail hidden" id="s${id}">
                    <article class="animeDetail">
                        <div class="title">
                            <h3>${detailTitle}</h3>
                            <p>${detailTitle}</p>
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