import {getAnimeNow} from './utils.js'
const sliderContainer = document.querySelector('.slider')

const animeSlider = await getAnimeNow(1,5)
let i=1;
animeSlider.map(anime => {
    const {images,title} = anime
    sliderContainer.innerHTML += `
       <img src="${images.jpg.large_image_url}" alt="${title}" tabindex="${i++}" />
    `
    console.log(images)
})
console.log(sliderContainer)