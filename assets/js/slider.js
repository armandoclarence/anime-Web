import {getAnimeKitsuResponse} from './utils.js'
const sliderContainer = document.querySelector('.slider')

async function getImg(){
    const animeSlider = await getAnimeKitsuResponse('anime','filter[status]=current&page[limit]=5&page[offset]=20')
    let i = 0
    let anime = animeSlider.map(img=>{
        console.log(img)
        const {attributes} = img
        const {coverImage,titles} = attributes
        return `<a style="background-image: url('${coverImage.original}')" alt="${titles.en_jp}" tabindex="${i++}" />`
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
    console.log(j)
    sliderContainer.style.transform = `translate3d(${-img.clientWidth * j}px,0px,0px)`
    console.log("img",img.clientWidth)
});
for(let img of imgs) {
    imgs[9].classList.add('prev-slide')
    imgs[0].classList.add('current-slide')
    imgs[1].classList.add('next-slide')
    // img.addEventListener('mousedown',function(){
    //     sliderContainer.style.transform = `translate3d(${-img.clientWidth * j++}px,0px,0px)`
    //     if(j==10){
    //         j=0;
    //     }
    // })
}
let k=1
let j = 1
let imgLength = imgs.length
setInterval(()=>{
    imgs[imgLength - 1].classList.remove('prev-slide')
    console.log(k)
    if(k == 10){
        imgs[9].classList.remove('current-slide')
        imgs[9].classList.add('prev-slide')
        imgs[0].classList.add('current-slide')
        k=1;
    }
    else{
        k - 2 >= 0 && imgs[k-2].classList.remove('prev-slide')
        imgs[k-1].classList.add('prev-slide')
        imgs[k-1].classList.remove('current-slide')
        imgs[k].classList.add('current-slide')
        imgs[k].classList.remove('next-slide')
        k< 9 && imgs[k+1].classList.add('next-slide')
        k< 9 && imgs[k+1].classList.remove('current-slide')
    }
    k++
    // console.log(k++, imgLength-1)
    sliderContainer.style.transitionDelay = '0ms'
    sliderContainer.style.transform = `translate3d(${-(img.clientWidth) *  (j<10 ? j++ : j=0)}px,0px,0px)`
},3000)