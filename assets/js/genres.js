import { getAnimeGenres, getAnimesByCategory, makeScheduleList } from "./utils.js"
import { prevButton, nextButton } from "./main.js"
const categoryContainer = document.querySelector('.categories')
const container = document.querySelector('.categoryAnimes')
const page = document.querySelector('.page')
let params = new URLSearchParams(window.location.search)
let pageNumber = 1
window.addEventListener('load',function(e){
    category()
    let name = params.get('category')
    console.log(name)
    if(name){
        const title = document.querySelector('.cards h2')
        title.textContent = `Category ${name}`
        container.removeChild(categoryContainer)
        container.classList.add('anime')
        page && page.classList.remove('hidden')
        getAnimesByCategory(name,pageNumber)
        console.log(prevButton)
        prevButton && prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimesByCategory(name,pageNumber)
        
        })
        nextButton && nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 1)prevButton.removeAttribute('disabled', '')
            getAnimesByCategory(name,pageNumber)
        })
    }
})

export function category(){
    getAnimeGenres().then((genres)=>{
        console.log(genres)
        genres.map(({name,count}) => {
            categoryContainer.innerHTML += `
            <li class="category">
                <a href="?&category=${name}">
                    <span>${name}</span>
                    <span class="count">${count}</span>
                </a>
            </li>`
        })
    })
}




