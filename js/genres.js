import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
const genreContainer = document.querySelector('.genres')
console.log(genreContainer)
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        genres.map(({mal_id,name,count}) => {
            genreContainer.innerHTML += `
            <li class="genre" id="${mal_id}">
                <a href="/genre/${name}">
                    <span>${name}</span>
                    <span>${count}</span>
                </a>
            </li>`
        })
        let genreButtons = document.querySelectorAll('.genre');
        genreButtons.forEach(genreButton => {
            console.log(genreButton)
            let params = this.location.pathname;
            console.log(params)
            genreButton.addEventListener('click',({name})=>{
                let id = params.get('genre-id')

                console.log(name)
                this.location.href = `/${name}`
                getAnimeByGenre(id)
            })
            
        })
        console.log(this)
    })
})




