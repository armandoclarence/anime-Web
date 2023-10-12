import {getAnimeCompleted, getAnimeByQuery, getAnimeOnGoing}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
let page = document.querySelector('.page')
let pageNumber = 1

search.addEventListener('change', e =>{
    e.preventDefault()
    params.set('s', search.value)
    window.location.search = params
})

window.addEventListener('load', function(e){
    page.innerHTML = ''
    let query = params.get('s')
    if(!query) {
        // getAnimeOnGoing()
        getAnimeCompleted(pageNumber)
        page.append(prevButton,nextButton)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 0) {
                // getAnimeOnGoing()    
                this.setAttribute('disabled', '')
            }
            getAnimeCompleted(pageNumber)

        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeCompleted(pageNumber)
        })
    } else{
        getAnimeByQuery(query)
    }
})

