import { getAnimeGenre, getAnimeByGenre } from "./utils.js"
const container = document.querySelector('.container')
window.addEventListener('load',function(e){
    getAnimeGenre().then((genres)=>{
        console.log(genres)
        genres.map(({mal_id,name,count}) => {
            container.innerHTML += `
            <button class="genre">
                <a href="?genre-id=${mal_id}" id="${mal_id}">${name} | ${count}</a>
            </button>`
        })
        let genreButton = this.document.querySelectorAll('.genre');
        let params = new URLSearchParams(window.location.search)
        let id = params.get('genre-id')
        // this.location.href = `?${id}`
        getAnimeByGenre(id)
        console.log(genreButton)
        console.log(this.location.href)
        console.log(params)
        console.log(this)
    })
})




