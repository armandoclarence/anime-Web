import {getAnimeKitsuResponse} from './utils.js'
const sliderContainer = document.querySelector('.slider')

async function getImg(){    
    const animeSlider = await getAnimeKitsuResponse('anime','filter[seasonYear]=2023&filter[status]=current&page[limit]=5')
    let i = 0
    let anime = animeSlider.map(img=>{
        const {attributes} = img
        const {coverImage,titles} = attributes
        console.log(coverImage)
        return `<a href="/" aria-label="${titles.en_jp}" style="background-image: url('${coverImage.small}')" alt="${titles.en_jp}" tabindex="${i--}" />`
    })
    return anime
}
const anime = await getImg()
let duplicateAnime = [...anime].join('');
sliderContainer.innerHTML += duplicateAnime
sliderContainer.innerHTML += duplicateAnime

let img = document.querySelector('.slider a')
let [...imgs] = document.querySelectorAll('.slider a')

window.addEventListener('resize',function(e){
    sliderContainer.style.transform = `translate3d(${-img.clientWidth * j}px,0px,0px)`
});
for(let img of imgs) {
    imgs[9].classList.add('prev-slide')
    imgs[0].classList.add('current-slide')
    imgs[1].classList.add('next-slide')
}
let k=1
let j = 1
let imgLength = imgs.length
setInterval(()=>{
    console.log(k)
    if(k == 10){
        imgs[8].classList.remove('prev-slide')
        imgs[9].classList.remove('current-slide')
        imgs[9].classList.add('prev-slide')
        imgs[0].classList.add('current-slide')
        k=0;
    }
    else{
        imgs[imgLength - 1].classList.remove('prev-slide')
        k - 2 >= 0 && imgs[k-2].classList.remove('prev-slide')
        imgs[k-1].classList.add('prev-slide')
        imgs[k-1].classList.remove('current-slide')
        imgs[k].classList.add('current-slide')
        imgs[k].classList.remove('next-slide')
        k< 9 && imgs[k+1].classList.add('next-slide')
        k< 9 && imgs[k+1].classList.remove('current-slide')
    }
    k++
    sliderContainer.style.transitionDelay = '0ms'
    sliderContainer.style.transform = `translate3d(${-(img.clientWidth) *  (j<10 ? j++ : j=0)}px,0px,0px)`
},2000)