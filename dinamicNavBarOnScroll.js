const maxHeight = 80 // Height after which the navbar will change, same as initial padding

function navbarAdjust() {
    if (document.body.scrollTop > maxHeight || document.documentElement.scrollTop > maxHeight) {
        document.querySelector("nav").style.padding = "30px 10px";
        document.querySelector("#logo").style.width = "150px"
    } else {
        document.querySelector("nav").style.padding = "80px 10px";
        document.querySelector("#logo").style.width = "200px"
    }

}


window.addEventListener("scroll", navbarAdjust)