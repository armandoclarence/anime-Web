const baseUrl = "https://anime-api.cyclic.cloud/"
const container = document.querySelector('.container')
const userSelect = document.querySelector('#userSelect')
window.addEventListener('load',function(e){
    getAnime()
})

const getAnime = async() =>{
    const anime = await fetch(`${baseUrl}genres`)
    const genres = await anime.json()
    genres.map(({name}) => {
        container.innerHTML += `
            <button data-value=${name}>${name}</button>
        `
    })
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        button.addEventListener('click', function(){
            let genre =  this.getAttribute('data-value')
            getAnimeByGenre(genre)
        })
    })
}

const getAnimeByGenre = async(genre) => {
    console.log(genre)
}

console.log(window)