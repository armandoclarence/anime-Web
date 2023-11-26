import { getAnimeCategories, getAnimeResponse } from "./utils.js"
const categoryContainer = document.querySelector('ul#categories')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
window.addEventListener('load', async function(e){
    const filter = {
        types: [],
        years: [],
        categories: [],
        ratings: [],
        statusAnime: [],
        country: [],
        season: [],
        sorting: []
    }
    await makeYearList()
    await makeCategoryList()
    const [...checkboxes] = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.map(checkbox => {
        checkbox.addEventListener('change',function(){
            if(this.checked){
                const thisList = this.parentNode.parentNode
                const idParent = thisList.getAttribute("id")
                const id = this.getAttribute("id")
                console.log(this)
                console.log(id)
                for(const key in filter){
                    if(key == idParent && !id.checked){
                        filter[key].push(id)
                        console.log(key)
                        console.log(filter[key])
                        console.log(filter)
                    }
                    if(!id.checked){
                        const index = filter[key].indexOf(id);
                        filter[key].splice(index, 1);
                    }
                }
            }
        })
    })
    console.log(filter)
    console.log(checkboxes)
})


async function makeCategoryList(){
    const categories = await getAnimeCategories();
    categories.map(({attributes})=>{
        const {title} = attributes
        categoryContainer.innerHTML += `
            <li title="${title}">
                <input type="checkbox" name="${title}" id="${title}"/>
                <label for="${title}">${title}</label>
            </li>
        `
    })
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