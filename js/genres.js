import { getAnimeGenre } from "./utils.js"
const container = document.querySelector('.container')
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({name}) => {
            container.innerHTML += `
            <button class="genre">
                <a href="?genre-list=${name}">${name}</a>
            </button>`

        })
    })
    let params = new URLSearchParams(window.location.search)
    let genre = params.get('genre-list')
    
    console.log(genre)
})




