import { getAnimesByFilter, getAnimeCategories, getAnimeResponse } from "./utils.js"
const categoryContainer = document.querySelector('ul#categories')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
const filterButton = document.querySelector('#filter')

let params = new URLSearchParams(window.location.search)

window.addEventListener('load', async function(e){
    const localKey = 'filter';
    await makeYearList()
    await makeCategoryList()
    const newFilter = {}
    const filter = JSON.parse(this.localStorage.getItem(localKey)) || {
        types: [],
        years: [],
        categories: [],
        ratings: [],
        statusAnime: [],
        country: [],
        seasons: [],
        sorting: []
    }
    for(const key in filter){
        const query = params.get(key) || ''
        filter[key].map(filtering =>{
            filtering = filtering>0 ?filtering.replace(/^/,"s") : filtering.split(' ').join("")
            let checkbox = document.querySelector(`#${filtering}`)
            checkbox.checked = true
        })
        newFilter[key]=query
    }
    await getAnimesByFilter(newFilter)
    const [...checkboxes] = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.map(checkbox => {
        checkbox.addEventListener('change',function(){
            const thisList = this.parentNode.parentNode
            const idParent = thisList.getAttribute("id")
            const name = this.getAttribute("name")
            if(this.checked){
                filter[idParent].push(name)
            }if(!this.checked){
                const index = filter[idParent].indexOf(name)
                filter[idParent].splice(index,1)
            }
            console.log(filter)
        })
    })
    
    filterButton.addEventListener('click',function(e){
        for(const key in filter){
            if(filter[key].length>0){
                params.set(key, filter[key])
            }else{
                params.delete(key)
            }
        }
        window.location.search = params
        localStorage.setItem(localKey, JSON.stringify(filter))
    })
})


async function makeCategoryList(){
    const categories = await getAnimeCategories();
    categories.map(({attributes})=>{
        const {title} = attributes
        const id = title.split(' ').join("")
        categoryContainer.innerHTML += `
            <li title="${title}">
                <input type="checkbox" name="${title}" id="${id}"/>
                <label for="${id}">${title}</label>
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
                <input type="checkbox" name="${year}" id="s${year}"/>
                <label for="s${year}">${year}</label>
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