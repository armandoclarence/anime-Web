import { genre } from "./genres.js"
import { getAnimeSeason } from "./utils.js"
const list = document.querySelector('.list')
window.addEventListener('load', function(e){
    genre()
})
list.addEventListener('click',function(){
    this.childNodes[1].classList.remove('hidden')
})