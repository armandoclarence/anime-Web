import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
const genreContainer = document.querySelector('.genres')
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        let genre = genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre" name="${name}" id="${mal_id}">
                <a href="?genre-id=${mal_id}">
                    <span>${name}</span>
                    <span>${count}</span>
                </a>
            </li>`
            return name
        })
        genre.map(genre => {
            console.log(genre)
        })
        console.log(genre)
        let genreButtons = document.querySelectorAll('.genre');
        genreButtons.forEach(genreButton => {
            genreButton.addEventListener('click',function(e){
                let params = new URLSearchParams(window.location.search)
                let id = params.get('genre-id')
                let name = this.getAttribute('name')
                console.log(this)
                getAnimeByGenre(id)
                window.location.href = `/${name}`
            })
            
        })
        console.log(this)
    })
})




