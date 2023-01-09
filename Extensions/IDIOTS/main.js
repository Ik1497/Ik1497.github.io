app()

async function app() {
    let idiots = await fetch(`data.json`)
    idiots = await idiots.json()
    let randomIdiotsIndex = Math.floor(Math.random()*idiots.length)
    let idiot = idiots[randomIdiotsIndex];
    if (new URLSearchParams(window.location.search).get(`force`) != null) {
        idiots.forEach(idiotList => {
            if (idiotList.user === new URLSearchParams(window.location.search).get(`force`)) {
                idiot = idiotList
            }
        });
    }
    document.querySelector(`main .idiot-image img.forground-image`).src = `./images/logos/${idiot.user}.png`

    for (let imagesRunTime = 0; imagesRunTime < (idiot.images + 1); imagesRunTime++) {
        document.querySelector(`main .idiot-grid`).insertAdjacentHTML(`beforeend`, `<img src="./images/messages/${idiot.user}-${imagesRunTime}.png">`)
    }

    document.querySelector(`main .idiot-grid`).insertAdjacentHTML(`afterbegin`, `<p style="padding: 0; padding-left: 1rem;">${idiot.images + 1}x an idiot<br>${idiot.user.replaceAll(`-`, ` `)}</p>`)
}
