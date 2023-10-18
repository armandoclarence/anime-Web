import { getAnimeSeason } from "./utils.js"
const seasons = document.querySelector('.seasons')

window.addEventListener('load', function(e){
    getAnimeSeason()
})