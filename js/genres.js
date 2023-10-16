import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
import { prevButton, nextButton } from "./main.js"
const genreContainer = document.querySelector('.genres')
let pageNumber = 1
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
        prevButton.addEventListener('click', function(e){
            const id = this.getAttribute('id')
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeByGenre(id,pageNumber)

        })
        
        nextButton.addEventListener('click', function(e){
            const id = this.getAttribute('id')
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeByGenre(id,pageNumber)
        })
        let genreButtons = document.querySelectorAll('.genre');
        genreButtons.forEach(genreButton => {
            genreButton.addEventListener('click',function(e){
                e.preventDefault()
                const id = this.getAttribute('id')
                nextButton.setAttribute('id', id)
                prevButton.setAttribute('id', id)
                getAnimeByGenre(id,pageNumber)
            })
            
        })
    })
})




