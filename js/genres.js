import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
const genreContainer = document.querySelector('.genres')
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre" id="${mal_id}">
                <a href="/?genreId=${mal_id}">
                    <span>${name}</span>
                    <span>${count}</span>
                </a>
            </li>`
        })
        let genreButtons = document.querySelectorAll('.genre');
        genreButtons.forEach(genreButton => {
            genreButton.addEventListener('click',function(e){
                e.preventDefault()
                const id = this.getAttribute('id')
                getAnimeByGenre(id)
            })
            
        })
    })
})




