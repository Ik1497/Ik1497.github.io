document.body.insertAdjacentHTML(`afterbegin`, `<nav><ul></ul></nav><main></main>`)

app()

async function app() {
  // Fetch Sub-Actions List
  let subActions = await fetch(`/api/Sub-Actions.json`)
  subActions = await subActions.json()
  console.log(subActions)

  // Put all unique groups in an array
  let uniqueGroupDirectories = []

  subActions.forEach(subAction => {
    if (!uniqueGroupDirectories.includes(subAction.groupDirectory)) {
      uniqueGroupDirectories.push(subAction.groupDirectory);
    }
  })
  uniqueGroupDirectories.sort()
  
  // Check how big a group is so "group1" would be the length of 1 and "group1/group2" would be the length of 2. Also put these in an array so ["group1", "group2"]
  let uniqueGroupDirectoriesSorted = []

  uniqueGroupDirectories.forEach(uniqueGroupDirectory => {
    uniqueGroupDirectoriesSorted.push(uniqueGroupDirectory.split(`/`))
  })

  // Put folders in DOM

  uniqueGroupDirectoriesSorted.forEach(uniqueGroupDirectorySorted => {
    let uniqueGroupDirectoryPath = uniqueGroupDirectorySorted.toString().replaceAll(`,`, `/`);
    let uniqueGroupDirectoryPathVisual = uniqueGroupDirectorySorted.toString().replaceAll(`,`, ` > `);
    document.querySelector(`nav ul`).insertAdjacentHTML(`beforeend`, `<p class="directory-title" title="${uniqueGroupDirectoryPathVisual}">${uniqueGroupDirectoryPathVisual}</p>`)
    console.log(uniqueGroupDirectoryPath)

    subActions.forEach(subAction => {
      if (subAction.groupDirectory === uniqueGroupDirectoryPath) {
        document.querySelector(`nav ul`).insertAdjacentHTML(`beforeend`, `<li class="sub-action" title="${subAction.name.toString()}"><button><p class="sub-action-title">${subAction.name}</p><p class="sub-action-description">${subAction.description}</p></button></li>`)
      }
    })
  })
}
