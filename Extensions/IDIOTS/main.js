app()

async function app() {
    let idiots = await fetch(`data.json`)
    idiots = await idiots.json()
    let randomIdiotsIndex = Math.floor(Math.random()*idiots.length)
    let idiot = idiots[randomIdiotsIndex];
    document.querySelector(`main .idiot-image img.forground-image`).src = `./images/logos/${idiot.user}.png`
    console.log(idiot, idiots)

    for (let imagesRunTime = 0; imagesRunTime < (idiot.images + 1); imagesRunTime++) {
        document.querySelector(`main .idiot-grid`).insertAdjacentHTML(`beforeend`, `<img src="./images/messages/${idiot.user}-${imagesRunTime}.png">`)
    }
}
