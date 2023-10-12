import {getAnime,makeCard,baseUrl, getAnimeOnGoing}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
let page = document.querySelector('.page')
let pageNumber = 0
console.log(getAnime)

search.addEventListener('change', e =>{
    e.preventDefault()
    params.set('s', search.value)
    // console.log(thi)
    window.location.search = params
})

window.addEventListener('load', function(e){
    page.innerHTML = ''
    let query = params.get('s')
    console.log(query)
    if(!query) {
        get
        page.append(prevButton,nextButton)
        prevButton.addEventListener('click', function(e){
            if(pageNumber == 0) {
                getAnimeOnGoing()
                this.setAttribute('disabled', '')
            }
            getAnime(pageNumber--)
        })
        
        nextButton.addEventListener('click', function(e){
            // pageNumber++
            if(pageNumber >= 1)prevButton.removeAttribute('disabled', '')
            getAnime(pageNumber++)
        })
        // getAnime(pageNumber)
    } else{
        getAnimeByQuery(query)
    }
})

async function getAnimeByQuery(query){
    const anime = await fetch(`${baseUrl}search?q=${query}`)
    const animeData = await anime.json()
    const {data} = animeData;
    makeCard(data)
    console.log(data)
    // const {collection} = animeData;
}


// console.log(this)
