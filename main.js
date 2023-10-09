
const cardDetail = document.querySelector('.card-detail')
const modal = document.querySelector('[data-modal]')
const baseUrl = "https://anime-api.cyclic.cloud/"

const container = document.querySelector('.container-card')

window.addEventListener('load',function(e){
    getAnime()
})

async function getAnime(){
    const anime = await fetch(`${baseUrl}complete-anime`)
    const animeData = await anime.json()
    const {collection} = animeData;
    const {data} = collection;
    console.log(data);
    makeCard(data)
}


function makeCard(datas){
    datas.map(data => {
        const {title, thumbnail, slug, rating, releaseDate, status} = data
        container.innerHTML += `
            <article class="card home" value=${slug}>
                <h2>${title}</h2>
                <img src="${thumbnail}" alt="${slug}" />
                <p>Rating: ${rating}</p>
                <p>${releaseDate}</p>
                <p>${status}</p>
                </article>`
            })
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => card.addEventListener('click',function(){
        let slug = this.getAttribute('value')
        getAnimeDetail(slug)
        modal.showModal()
    }))
}

function getAnimeDetail(slug){
    fetch(`${baseUrl}anime/${slug}`)
    .then(res => res.json())
    .then((data) => {
        const {title, thumbnail, genres, score,episodeLists} = data
        let episodeList = episodeLists.map(episodeList => {
                const { slug } = episodeList
                return slug
            }
        )
        cardDetail.innerHTML =` <article class="card detail">
            <h2>${title}</h2>
            <img src="${thumbnail}" alt="" />
            <ul>
                ${genres.map(genre => {
                    return `<li>${genre}</li>`  
                })}
            </ul>
            <p>rating: ${score}</p>
            <ul>
                ${episodeList.map(episode => {
                    let episodeNumber = episode.replace(/(\D+)-(\D+)/g, "");
                        return `<li>
                            <button data-value="${episode}" 
                            >
                                <a>
                                    ${episodeNumber}
                                </a>
                            </button>
                        </li>`
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
   })
}

function getAnimeEpisode(episodeButtons){
    episodeButtons.forEach(episodeButton => {
        let episode = episodeButton.getAttribute('data-value')
        fetch(`${baseUrl}episode/${episode}`)
        .then(res => res.json())
        .then(({streamLink})=>{
            episodeButton.childNodes[1].setAttribute('href', streamLink)
            episodeButton.childNodes[1].setAttribute('target', '_blank')
        })
    })
}

