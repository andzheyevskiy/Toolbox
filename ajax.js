async function getData() {
    const url = "myurl"
    const response = await fetch(url)
    const json = await response.json()
    console.log(json)
    return json
}

getData()