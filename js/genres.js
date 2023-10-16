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
            <li class="genre" id="${mal_id}">
                <a href="">
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
                params.set('genreId',id)
                console.log(id)
                console.log(params)
                console.log(window.location)
                window.location.search = params
            })
        })
    })
    let id = params.get('genreId')
    console.log(container)
    if(id){
        container.removeChild(genreContainer)
        page.classList.remove('hidden')
        nextButton.setAttribute('id', id)
        prevButton.setAttribute('id', id)
        getAnimeByGenre(id,pageNumber)
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
    }
})




