function saveKeyToStorage(storage, data) {
  let storedJsonString = localStorage.getItem(storage) || `{}`
  let storedJson = JSON.parse(storedJsonString) || {}
  let storedJsonEntries = Object.entries(storedJson) || []

  if (typeof data != `object`) return

  Object.entries(data).forEach(dataPair => {
    storedJsonEntries.push([dataPair[0], dataPair[1]])
  });

  let storedNewJson = Object.fromEntries(storedJsonEntries)
  let storedNewJsonString = JSON.stringify(storedNewJson)
  localStorage.setItem(storage, storedNewJsonString)

  return storedNewJson
}

function saveItemToStorage(storage, data) {
  let storedJsonString = localStorage.getItem(storage) || `[]`
  let storedJson = JSON.parse(storedJsonString) || []

  storedJson.push(data)

  let storedNewJsonString = JSON.stringify(storedJson)
  localStorage.setItem(storage, storedNewJsonString)

  return storedJson
}

function loadDataFromStorage(storage, type = `object`) {
  let storedJsonString = localStorage.getItem(storage) || `{}`
  let storedJson = JSON.parse(storedJsonString) || {}
  
  if (type === `array`) {
    storedJsonString = localStorage.getItem(storage) || `[]`
    storedJson = JSON.parse(storedJsonString) || []
  }

  return storedJson
}