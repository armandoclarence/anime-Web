const search = document.querySelector('#search')
const baseUrl = "https://anime-api.cyclic.cloud/"

search.addEventListener('change', function(){
    
    let q = search.value
    fetch(`${baseUrl}search?q=${q}`)
    .then(res => res.json())
    .then(({datas}) => {
        datas.foreach(data => {
            const container = document.querySelector(".container")

            container.html = `<ul></ul>`
            console.log(data)
        })
    })
})


