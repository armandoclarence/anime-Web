import {getAnimeCompleted, getAnimeByQuery}  from './utils.js'
import { prevButton, nextButton } from './main.js'
const search = document.querySelector('#search')
let params = new URLSearchParams(window.location.search)
let page = document.querySelector('.page')
let pageNumber = 1

if(search){

    search.addEventListener('change', e =>{
        e.preventDefault()
        params.set('s', search.value)
        window.location.search = params
    })
}


window.addEventListener('load', function(e){
    page.innerHTML = ''
    let query = params.get('s')
    if(!query) {
        getAnimeCompleted(pageNumber)
        page.append(prevButton,nextButton)
        prevButton.addEventListener('click', function(e){
            pageNumber--
            if(pageNumber == 1) {
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
        getAnimeByQuery(query,pageNumber)
        page.append(prevButton,nextButton)
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

