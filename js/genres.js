import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
import { prevButton, nextButton } from "./main.js"
const genreContainer = document.querySelector('.genres')
const container = document.querySelector('.container')
const page = document.querySelector('.page')
let params = new URLSearchParams(window.location.search)
let pageNumber = 1
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <a href="?genreId=${mal_id}">
                    <span>${name}</span>
                    <span>${count}</span>
                </a>
            </li>`
        })
    })
    let id = params.get('genreId')
    if(id){
        container.removeChild(genreContainer)
        page.classList.remove('hidden')
        getAnimeByGenre(id,pageNumber)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeByGenre(id,pageNumber)

        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeByGenre(id,pageNumber)
        })
    }
})




