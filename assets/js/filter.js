import { getAnimeGenres } from "./utils.js"
const genreContainer = document.querySelector('.genres')
const [...listButtons] = document.querySelectorAll('.list button')
window.addEventListener('load', function(e){
    getAnimeGenres().then((genres)=>{
        genres.map(({mal_id,name}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <input type="checkbox" name="${name}" id="${mal_id}"/>
                <label for="${mal_id}">${name}</label>
            </li>`
        })
    })
})
listButtons.map(listButton => {
    listButton.addEventListener('click',function(){
        this.nextElementSibling.classList.toggle('hidden')
        console.log(this.nextElementSibling)
    })
})