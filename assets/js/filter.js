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
    const [...radios] = document.querySelectorAll('input[type=radio]')
    for(const key in filter){
        const query = params.get(key) || ''
        let radio = document.querySelector(`input[value="${filter[key]}"]`)
        radio ?radio.checked = true: ''
        if(filter["keyword"].length>0){
            radios[0].parentNode.classList.remove('hidden')
        }else{
            radios[0].parentNode.classList.add('hidden')
        }
        key != 'keyword' &&  key!= 'sorting' ? filter[key].map(filtering =>{
            filtering = filtering>0 ?filtering.replace(/^/,"s") : filtering.split(' ').join("")
            let checkbox = document.querySelector(`#${filtering}`)
            checkbox ? checkbox.checked = true: ''
        }) 
        :
        params.get('keyword') !=null ?
        search.value = filter[key]
        :''
        newFilter[key]=query
    }
    const [...lists] = this.document.querySelectorAll('.list')
    lists.map(list => {
        list.addEventListener('click', function(e) {
            let clickedLi = e.target.closest('li')
            if (clickedLi) {
                let checkbox = clickedLi.children[0]
                let radio = clickedLi.querySelector('input[type="radio"]')  
                console.log(checkbox)
                const thisList = clickedLi.parentNode
                const idParent = thisList.getAttribute("id")
                const textButton = clickedLi.children[1].childNodes[0].data;
                const name = checkbox.getAttribute("name")
                const buttonLink = document.querySelector(`button#${idParent}`)
                console.log(clickedLi)
                console.log(buttonLink)  
                console.log(idParent)  
                console.log(name)
                console.log(filter)
                if(radio){
                    radio.checked = true
                    filter["sorting"] = radio.value
                    buttonLink.textContent = radio.getAttribute('value')
                }
                if (checkbox) {
                    checkbox.checked = !checkbox.checked
                  console.log(buttonLink.textContent)
                }
                if(checkbox.checked){
                    // buttonLink.textContent += buttonLink.getAttribute('data-value')
                    filter[idParent].push(name)
                }else{
                    buttonLink.textContent = buttonLink.getAttribute('data-value')
                    const index = filter[idParent].indexOf(name)
                    name !='sort' ?filter[idParent].splice(index,1):''
                }
                if(filter[idParent].length>2){
                    buttonLink.textContent =  `${filter[idParent].length} selected`;
                }else if(filter[idParent].length>0){
                    console.log(filter[idParent])
                    buttonLink.textContent = filter[idParent]
                }
            }
            console.log(filter)
        })
    })
    getAnimesByFilter(newFilter)
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
    let years= await getAnimeResponse('seasons')
    const yearsWrapper = document.querySelector('ul#years')
    years = years.filter(({year})=> year>2000 || year <= 2000 & year%10==0)
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