const search = document.querySelector('#search')
const baseUrl = "https://anime-api.cyclic.cloud/"

const container = document.querySelector('.container')
search.addEventListener('change', function(){
    
    let q = search.value
    fetch(`${baseUrl}search?q=${q}`)
    .then(res => res.json())
    .then(({data}) => 
        data.forEach(animeData => {
            const {title, thumbnail, slug, genres, rating } = animeData
            container.innerHTML += `<article>
                <h2>${title}</h2>
                <img src="${thumbnail}" alt="anime..." />
                <p>${slug}</p>
                <ul>
                    ${genres.map(genre => {
                        return `<li>${genre}</li>`  
                    })}
                </ul>
            </article>`
            console.log(container)
            console.log(animeData)
        })
        // container.innerHTML = ''
    )
})


