import { getAnimeCategories, getAnimeResponse } from "./utils.js"
const categoryContainer = document.querySelector('ul#categories')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
window.addEventListener('load', function(e){
    makeYearList()
    makeCategoryList()
})

async function makeCategoryList(){
    const categories = await getAnimeCategories();
    categories.map(({attributes})=>{
        const {title} = attributes
        categoryContainer.innerHTML += `
            <li>
                <input type="checkbox" name="${title}" id="${title}"/>
                <label for="${title}">${title}</label>
            </li>
        `
    })
    console.log(categories)
}

async function makeYearList(){
    const yearsRes = await getAnimeResponse('seasons')
    const yearsWrapper = document.querySelector('ul#years')
    let yearU2000 = yearsRes.filter(({year})=> year>=2000)
    let yearD2000 = yearsRes.filter(({year})=> year < 2000 & year%10==0)
    yearD2000 = yearD2000.map(({year}) => JSON.parse(`{"year":"${year}s"}`))
    const years = [...yearU2000,...yearD2000]
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
        listFilter.classList.toggle('hidden')
        listFilter.style.top = `${this.offsetTop + this.offsetHeight + 5}px`
        listFilter.style.left =`${this.offsetLeft}px`
        notTargetFilter.map(notTarget => {
            notTarget.classList.add('hidden')
        })
    })
})