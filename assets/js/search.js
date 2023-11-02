import {getAnimeCompleted, getAnimeByQuery, getAnimeNow}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
const container = document.querySelector('.container')
const title = document.querySelector('.cards h2')
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
        getAnimeNow(pageNumber)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
                this.setAttribute('disabled', '')
            }
            getAnimeNow(pageNumber)

        })
        
        nextButton.addEventListener('click', function(e){
            pageNumber++
            if(pageNumber > 0)prevButton.removeAttribute('disabled', '')
            getAnimeNow(pageNumber)
        })
    } else{
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

