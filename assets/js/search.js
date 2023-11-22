import {getAnimeByQuery,getAnimeNows, getAnimeNow}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
const title = document.querySelector('.container h3')
const animeNowContainer = document.querySelector('.now-anime')
const animeQueryContainer = document.querySelector('.query-anime')
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
        getAnimeNows()
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeNow(pageNumber,14)
        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeNow(pageNumber,14)
        })
    } else{
        animeQueryContainer.classList.remove('hidden')
        animeNowContainer.classList.add('hidden')
        title.innerHTML = `search ${query}...`
        getAnimeByQuery(query,pageNumber)
        getAnimeNows()
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

