import { getAnimeSeason } from "./utils.js"
const lists = document.querySelectorAll('.lists')

window.addEventListener('load', function(e){
    getAnimeSeason()
    lists.forEach(list=> {
        list.addEventListener('click',function(){
            const filterList = document.querySelector(`.${this.classList[1]} ul`)
            filterList.classList.toggle('hidden')
            console.log(filterList)
            // console.log(this.classList[1])
        })
    })
})