const fs = require('fs');
const sizeOf = require('image-size');

const path = `Extensions/IDIOTS/`
const url = `https://ik1497.github.io/`

const data = JSON.parse(fs.readFileSync(path + `data.json`, `utf8`))

let idiots = {
  count: data.length,
  backgroundImages: [
    url + `Extensions/IDIOTS/images/background/0.jpg`
  ],
  idiots: []
}

data.forEach(idiot => {
  let idiotMessages = {
    count: idiot.images,
    messages: []
  }

  for (let imagesRunTime = 0; imagesRunTime < idiot.images; imagesRunTime++) {
    let idiotMessage = sizeOf(path + `images/messages/${idiot.user}-${imagesRunTime}.png`)
    let messageStats = fs.statSync(path + `images/messages/${idiot.user}-${imagesRunTime}.png`);
    
    idiotMessage.size = messageStats.size
    idiotMessage.image = url + `Extensions/IDIOTS/images/messages/${idiot.user}-${imagesRunTime}.png`
    
    idiotMessages.messages.push(idiotMessage)
  }

  let logoStats = fs.statSync(path + `images/logos/${idiot.user}.png`);
  let logo = sizeOf(path + `images/logos/${idiot.user}.png`)

  logo.size = logoStats.size
  logo.image = url + `Extensions/IDIOTS/images/logos/${idiot.user}.png`

  idiots.idiots.push({
    name: idiot.user,
    display: idiot.display,
    logo: logo,
    messages: idiotMessages
  })
});

let fileContents = JSON.stringify(idiots, null, 2)

fs.writeFile(path + `api.json`, fileContents, function (err) {
  if (err) throw err;
});
