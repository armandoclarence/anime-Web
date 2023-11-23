import { getAnimeGenres, getAnimeResponse } from "./utils.js"
const genreContainer = document.querySelector('.genres')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
window.addEventListener('load', function(e){
    getAnimeGenres().then((genres)=>{
        genres.map(({mal_id,name}) => {
            genreContainer.innerHTML += `
            <li class="genre">
                <input type="checkbox" name="${name}" id="${mal_id}"/>
                <label for="${mal_id}">${name}</label>
            </li>`
        })
    })
    makeYearList()
})

async function makeYearList(){
    const yearsRes = await getAnimeResponse('seasons')
    const yearsWrapper = document.querySelector('ul#years')
    let yearU2000 = yearsRes.filter(({year})=> year>=2000)
    let yearD2000 = yearsRes.filter(({year})=> year < 2000 & year%10==0)
    yearD2000 = yearD2000.map(({year}) => JSON.parse(`{"year":"${year}s"}`))
    const years = [...yearU2000,...yearD2000]
    console.log(years)
    years.map(({year})=>{
        yearsWrapper.innerHTML += `
            <li>
                <input type="checkbox" name="${year}" id="${year}"/>
                <label for="${year}">${year}</label>
            </li>
        `
    })
}

listButtons.map(listButton => {
    listButton.addEventListener('click',function(){
        let id = this.getAttribute('id')
        const listFilter = document.querySelector(`ul#${id}`)
        const [...notTargetFilter] = document.querySelectorAll(`.lists ul:not(#${id})`)
        console.log(listFilter)
        listFilter.classList.toggle('hidden')
        listFilter.style.top = `${this.offsetTop + this.offsetHeight + 5}px`
        listFilter.style.left =`${this.offsetLeft}px`
        console.log(listFilter.style)
        notTargetFilter.map(notTarget => {
            notTarget.classList.add('hidden')
        })
    })
})