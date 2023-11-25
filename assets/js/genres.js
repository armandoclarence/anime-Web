import { getAnimeCategories, getAnimesByCategory } from "./utils.js"
import { prevButton, nextButton } from "./main.js"
const categoryContainer = document.querySelector('.categories')
const container = document.querySelector('.categoryAnimes')
const page = document.querySelector('.page')
let params = new URLSearchParams(window.location.search)
let pageNumber = 0
window.addEventListener('load',function(e){
    category()
    let name = params.get('category')
    if(name){
        const title = document.querySelector('.cards h2')
        title.textContent = `Category ${name}`
        container.removeChild(categoryContainer)
        container.classList.add('anime')
        page && page.classList.remove('hidden')
        getAnimesByCategory(name,pageNumber)
        prevButton && prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimesByCategory(name,pageNumber)
        
        })
        nextButton && nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimesByCategory(name,pageNumber)
        })
    }
})

export function category(){
    getAnimeCategories().then((category)=>{
        category.map(({attributes}) => {
            const {title,totalMediaCount} = attributes
            categoryContainer.innerHTML += `
            <li class="category">
                <a href="?&category=${title}">
                    <span>${title}</span>
                    <span class="count">${totalMediaCount}</span>
                </a>
            </li>`
        })
    })
}




