import {getAnimeByQuery,getAnimeNows}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
const title = document.querySelector('.container h3')
const animeNowContainer = document.querySelector('.now-anime')
const animeQueryContainer = document.querySelector('.query-anime')
console.log(title)
let pageNumber = 1



if(search){
    search.addEventListener('change', e =>{
        e.preventDefault()
        params.set('s', search.value)
        window.location.search = params
    })
}

window.addEventListener('load', function(e){
    let query = params.get('s')
    if(!query) {
        animeQueryContainer.classList.add('hidden')
        animeNowContainer.classList.remove('hidden')
        getAnimeNows(pageNumber)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeNows(pageNumber)
        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeNows(pageNumber)
        })
    } else{
        animeQueryContainer.classList.remove('hidden')
        animeNowContainer.classList.add('hidden')
        title.innerHTML = `search ${query}...`
        getAnimeByQuery(query,pageNumber)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeByQuery(query,pageNumber)

        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            console.log(query)
            getAnimeByQuery(query,pageNumber)
        })
    }
})

