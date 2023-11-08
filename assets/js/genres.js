import { getAnimeGenres, getAnimesByGenre } from "./utils.js"
import { prevButton, nextButton } from "./main.js"
const genreContainer = document.querySelector('.genres')
const container = document.querySelector('.genreAnimes')
const page = document.querySelector('.page')
let params = new URLSearchParams(window.location.search)
let pageNumber = 1
window.addEventListener('load',function(e){
    genre()
})

function genre(){
    getAnimeGenres().then((genres)=>{
        genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <a href="?genreId=${mal_id}&genre=${name}">
                    <span>${name}</span>
                    <span class="count">${count}</span>
                </a>
            </li>`
        })
    })
    console.log(page)
    let id = params.get('genreId')
    if(id){
        let name = params.get('genre')
        const title = document.querySelector('.cards h2')
        title.textContent = `Genre ${name}`
        container.removeChild(genreContainer)
        page && page.classList.remove('hidden')
        getAnimesByGenre(id,pageNumber)
        prevButton && prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimesByGenre(id,pageNumber)
    
        })
        nextButton && nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimesByGenre(id,pageNumber)
        })
    }
}




