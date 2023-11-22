const prevButton = document.querySelector('.prev')
const nextButton = document.querySelector('.next')

const bar = document.querySelector('.bar')
const navLink = document.querySelector('#nav ul')

navLink && navLink.classList.toggle('hidden')

console.log(bar)

bar && bar.addEventListener('click', function(e){
    navLink.classList.toggle('hidden')
})

export { prevButton, nextButton}