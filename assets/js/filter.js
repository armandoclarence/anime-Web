import { getAnimesByFilter, makePagingButton, getAnimeGenres, getAnimeResponse } from "./utils.js"
const categoryContainer = document.querySelector('ul#categories')
const [...listButtons] = document.querySelectorAll('.lists button:not(#filter)')
const filterButton = document.querySelector('#filter')
const search = document.querySelector('.search-i')

let params = new URLSearchParams(window.location.search)
window.addEventListener('load', async function(e){
    const localKey = 'filter';
    const newFilter = {}    
    const filter = !new URL(window.location).searchParams.get('page')? JSON.parse(this.localStorage.getItem(localKey)) : {
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
    const baseUrl = new URLSearchParams(window.location.search);
    baseUrl.forEach((value,key)=>{
        if(key == 'sorting' || key == 'keyword'){
            filter[key] = value
        }else if(key !== 'page' && key !== 'pages'){
            filter[key] =value.split(',')
        }
    })
    await makeCategoryList()
    await makeYearList()
    const [...radios] = document.querySelectorAll('input[type=radio]')
    for(const key in filter){
        const query = params.get(key) || ''
        let radio = document.querySelector(`input[value="${filter[key]}"]`)
        if(radio){
            radio.checked = true
            const buttonLink = document.querySelector(`button#${key}`)
            const label = radio.nextElementSibling
            buttonLink.textContent = label.childNodes[0].data
        }
        radio ?radio.checked = true: ''
        if(filter["keyword"].length>0){
            radios[0].parentNode.classList.remove('hidden')
        }else{
            radios[0].parentNode.classList.add('hidden')
        }
        key != 'keyword' &&  key!= 'sorting' ?filter[key].length>0 ? filter[key].map(filtering =>{
            filtering = filtering>0 ?filtering.replace(/^/,"s") : filtering.split(' ').join("")
            let checkbox = document.querySelector(`#${filtering}`)
            const buttonLink = document.querySelector(`button#${key}`)
            for(const filt of filter[key]){
                const button = document.querySelector(`label[for="${filt>0 ?`s${filt}`:filt}"]`)
                buttonLink.textContent += filter[key].length==1?`${button.childNodes[0].data}`:`${button.childNodes[0].data},`
            }
            checkFilter(filter,key,buttonLink)
            checkbox ? checkbox.checked = true: ''
        }) : '' 
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
                let checkbox = clickedLi.querySelector('input[type="checkbox"]')
                let radio = clickedLi.querySelector('input[type="radio"]')  
                const thisList = clickedLi.parentNode
                const idParent = thisList.getAttribute("id")
                const textButton = clickedLi.children[1].childNodes[0].data;
                const name = checkbox? checkbox.getAttribute("name"):radio.getAttribute("value")
                const buttonLink = document.querySelector(`button#${idParent}`)
                if(radio){
                    radio.checked = true
                    filter["sorting"] = radio.value
                    buttonLink.textContent = textButton
                }
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    const index = filter[idParent].indexOf(name);
        
                    if (checkbox.checked && index === -1) {
                        filter[idParent].push(name);
                    } else if (!checkbox.checked && index !== -1) {
                        filter[idParent].splice(index, 1);
                    }
                }        
                if(idParent!="sorting"){
                    checkFilter(filter,idParent,buttonLink)
                }
            }
            localStorage.setItem(localKey, JSON.stringify(filter))
            console.log(filter)
        })
    })
    const pageCount = params.get('pages') ?? 0
    const anime = await getAnimesByFilter(newFilter,pageCount)
    const {count} = anime
    filterPaging(count)
    search.addEventListener('change',function(e){
        // e.preventDefault()
        console.log(e)
        params.set('keyword', this.value)
        // window.location.search = params
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
        params.delete('pages')
        window.location.search = params
        localStorage.setItem(localKey, JSON.stringify(filter))
    })
})


function checkFilter(filter,key,buttonLink){
    if(filter[key].length>2){
        buttonLink.textContent =  `${filter[key].length} selected`
    }else if(filter[key].length>0){
        buttonLink.textContent = ''
        filter[key].map(filterButton=>{
            const button = document.querySelector(`label[for="${filterButton>0 ?`s${filterButton}`:filterButton}"]`)
            buttonLink.textContent += filter[key].length==1?`${button.childNodes[0].data}`:`${button.childNodes[0].data},`
        })
    }else{
        buttonLink.textContent = buttonLink.getAttribute('data-value')
    }
}

function filterPaging(count){
    makePagingButton(count)
}

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