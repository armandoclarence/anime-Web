import {getAnimeNow} from './utils.js'
const sliderContainer = document.querySelector('.sliders')

const animeSlider = await getAnimeNow(1,5)

animeSlider.map(anime => {
    const {images,title} = anime
    sliderContainer.innerHTML += `
    <div class="slider">
        <img src="${images.jpg.large_image_url}" alt="${title}" />
    </div>
    `
    console.log(images)
})
console.log(sliderContainer)