import { getAnimeGenre, getAnimeSeason } from "./utils.js"
const genreContainer = document.querySelector('.genres')
// const container = document.querySelector('.container')
const list = document.querySelector('.list button')
window.addEventListener('load', function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <input type="checkbox" name="${name}" id="${mal_id}"/>
                <label for="${mal_id}">${name}</label>
            </li>`
        })
    })
})
list.addEventListener('click',function(){
    this.nextElementSibling.classList.toggle('hidden')
    console.log(this.nextElementSibling)
})