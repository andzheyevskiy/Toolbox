function getRelativeURL(url, domain) {
    return url.startsWith(domain) ? url.slice(domain.length) : url
}

const domain = "https://example.com"
const anchors = [...document.querySelectorAll("a")]

anchors.forEach(e => {
    const currentHref = e.getAttribute("href")
    const newHref = getRelativeURL(currentHref, domain)
    e.setAttribute("href", newHref)
})