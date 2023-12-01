import { getAnimesByFilter, getAnimeGenres, getAnimeResponse } from "./utils.js"
const categoryContainer = document.querySelector('ul#categories')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
const filterButton = document.querySelector('#filter')
const search = document.querySelector('.search-i')
const paging = document.querySelectorAll('.page')

let params = new URLSearchParams(window.location.search)
console.log(paging)
window.addEventListener('load', async function(e){
    const localKey = 'filter';
    const newFilter = {}
    const filter = JSON.parse(this.localStorage.getItem(localKey)) || {
        types: [],
        years: [],
        categories: [],
        ratings: [],
        statusAnime: [],
        country: [],
        seasons: [],
        sorting: "",
        keyword: "",
    }
    console.log(filter)
    await makeCategoryList()
    await makeYearList()
    const [...checkboxes] = document.querySelectorAll('input[type="checkbox"]')
    const [...radios] = document.querySelectorAll('input[type=radio]')
    console.log(radios)
    for(const key in filter){
        const query = params.get(key) || ''
        let radio = document.querySelector(`input[value="${filter[key]}"]`)
        if(key == 'keyword' && filter[key].length>0){
            radios[0].parentNode.classList.remove('hidden')
            params.set('sort','relevance')
        }
        console.log(filter[key])
        key != 'keyword' &&  key!= 'sorting' ? filter[key].map(filtering =>{
            filtering = filtering>0 ?filtering.replace(/^/,"s") : filtering.split(' ').join("")
            let checkbox = document.querySelector(`#${filtering}`)
            checkbox.checked = true
            console.log(checkbox.parentNode.parentNode)
        }) 
        :
        key == 'keyword' ?
        search.value = filter[key]
        :
        radio.checked = true
        newFilter[key]=query
    }
    radios.map(radio=>{
        radio.addEventListener('change',function(){
            filter["sorting"] = this.value
        })

    })
    const [...lists] = this.document.querySelectorAll('.list')
    console.log(lists)
    lists.map(list => {
        list.addEventListener('click', function(e) {
            let clickedLi = e.target.closest('li');
            if (clickedLi) {
              let checkbox = clickedLi.querySelector('input[type="checkbox"]') || clickedLi.querySelector('input[type="radio"]');
              if (checkbox) {
                checkbox.checked = !checkbox.checked;
              }
            }
            console.log(filter)
        });
    })
    getAnimesByFilter(newFilter)
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
        params.set('keyword', search.value)
        filter['keyword'] = search.value
        for(const key in filter){
            if(filter[key].length>0){
                params.set(key, filter[key])
            }else{
                params.delete(key)
            }
        }
        params.delete('page')
        window.location.search = params
        localStorage.setItem(localKey, JSON.stringify(filter))
    })
})


async function makeCategoryList(){
    const genres = await getAnimeGenres()
    genres.map(({name})=>{
        const id = name.split(' ').join("")
        categoryContainer.innerHTML += `
            <li title="${name}">
                <input type="checkbox" name="${name}" id="${id}"/>
                <label for="${id}">${name}</label>
            </li>
        `
    })
}

async function makeYearList(){
    const yearsRes = await getAnimeResponse('seasons')
    const yearsWrapper = document.querySelector('ul#years')
    let yearU2000 = yearsRes.filter(({year})=> year>2000)
    let yearD2000 = yearsRes.filter(({year})=> year <= 2000 & year%10==0)
    const years = [...yearU2000,...yearD2000]
    console.log(years);
    years.map(({year})=>{
        yearsWrapper.innerHTML += `
            <li>
                <input type="checkbox" name="${year}" id="s${year}"/>
                <label for="s${year}">${year<=2000 ? `${year}s`:year}</label>
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