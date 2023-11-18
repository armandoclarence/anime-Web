import {getAnimeNow} from './utils.js'
const sliderContainer = document.querySelector('.slider')

const animeSlider = await getAnimeNow(1,5)
let i=1;

let anime= animeSlider.map(anime => {
    const {images,title} = anime
    return `<img src="${images.jpg.large_image_url}" alt="${title}" tabindex="${i++}" />`
})

let duplicateAnime = [...anime].join('');
sliderContainer.innerHTML += duplicateAnime
sliderContainer.innerHTML += duplicateAnime

let j = 1
sliderContainer.addEventListener('mousedown',function(e){
    console.log(e)
    // this.style.transform = `translateX(${-1317 * j++}px)`
})
console.log(duplicateAnime)
console.log(sliderContainer)