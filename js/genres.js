import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
const genreContainer = document.querySelector('.genres')
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre" id="${mal_id}">
                <a href="?genre-id=${mal_id}">
                    <span>${name}</span>
                    <span>${count}</span>
                </a>
            </li>`
        })
        let genreButtons = document.querySelectorAll('.genre');
        genreButtons.forEach(genreButton => {
            console.log(genreButton)
            genreButton.addEventListener('click',({name})=>{
                let params = new URLSearchParams(window.location.search)
                let id = params.get('genre-id')

                console.log(name)
                this.location.href = `/${name}`
                getAnimeByGenre(id)
            })
            
        })
        console.log(this)
    })
})




