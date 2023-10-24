import { getAnimeGenre, getAnimeSeason } from "./utils.js"
const genreContainer = document.querySelector('.genres')
// const container = document.querySelector('.container')
const list = document.querySelector('.list')
window.addEventListener('load', function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <a href="?genreId=${mal_id}&genre=${name}">
                    <span>${name}</span>
                </a>
            </li>`
        })
    })
})
list.addEventListener('click',function(){
    this.childNodes[1].classList.remove('hidden')
})