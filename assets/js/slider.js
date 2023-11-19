import {getAnimeKitsuResponse} from './utils.js'
const sliderContainer = document.querySelector('.slider')

async function getImg(){
    const animeSlider = await getAnimeKitsuResponse('anime','filter[status]=current&page[limit]=5&page[offset]=20')
    let i = 1
    let anime = animeSlider.map(img=>{
        console.log(img)
        const {attributes} = img
        const {coverImage,titles} = attributes
        return `<a style="background-image: url('${coverImage.original}')" alt="${titles.en_jp}" tabindex="${i++}" />`
    })
    // const animeSlide = await getAnimeKitsuResponse('trending/anime','filter[status]=current&page[limit]=5&page[offset]=20')
    return anime
}
const anime = await getImg()
let duplicateAnime = [...anime].join('');
sliderContainer.innerHTML += duplicateAnime
sliderContainer.innerHTML += duplicateAnime

let img = document.querySelector('.slider a')
let [...imgs] = document.querySelectorAll('.slider a')
let j = 1

// window.addEventListener('resize',function(e){
//     let width = this.innerWidth;
//     console.log(e.target.innerWidth)
//     console.log("img",img.clientWidth)
// });
imgs.map(img => {
    img.addEventListener('mousedown',function(){
        sliderContainer.style.transform = `translate3d(${-img.clientWidth * j++}px,0px,0px)`
        if(j==10){
            j=0;
        }
    })
})
setInterval(()=>{
    sliderContainer.style.transitionDelay = '0ms'
    sliderContainer.style.transform = `translate3d(${-(img.clientWidth) *  (j<10 ? j++ : j=0)}px,0px,0px)`
},5000)