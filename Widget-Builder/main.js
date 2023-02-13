app()

async function app() {
  document.body.innerHTML = `
  <header>
    <a href="/">
      <div class="main">
        <img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon">
        <div class="name-description">
          <p class="name">Widget Builder</p>
          <p class="description">by Ik1497</p>
        </div>
      </div>
    </a>
    <ul class="header-links buttons-row">
    </ul>
  </header>
  <main>
  </main>
  `

  let navigation = await fetch(`/api/navigation.json`)
  navigation = await navigation.json()

  let navItems = []

  navigation.forEach(navigationGroup => {
    navigationGroup.groupItems.forEach(groupItem => {
      if (groupItem?.urlParameters != null) {
        console.log(groupItem)
        navItems.push(groupItem)
        document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `
        <div class="main" data-page="${groupItem.name}"></div>
        `)
      }
    });
  });

  reloadHeaderLinks()

  function reloadHeaderLinks() {
    document.querySelector(`header ul.header-links`).innerHTML = ``
    navItems.forEach(navItem => {
      console.log(location.hash.startsWith(pageUrl(navItem.name)), location.hash, pageUrl(navItem.name))
      document.querySelector(`header ul.header-links`).insertAdjacentHTML(`beforeend`, `
      <li${location.hash.startsWith(`#${pageUrl(navItem.name)}`) ? ` class="button-active"` : ``}>
        <a title="${navItem.name}" class="${navItem.icon}" ${location.hash.startsWith(`#${pageUrl(navItem.name)}`) ? `` : `href="#${pageUrl(navItem.name)}"`}>
          <p class="button-row-title">${navItem.name}</p>
        </a>
      </li$>
      `)

      let main = document.querySelector(`main .main[data-page="${navItem.name}"]`)


      
      if (location.hash.startsWith(`#${pageUrl(navItem.name)}`)) {

      }
    });
  
    document.querySelectorAll(`header ul.header-links li`).forEach(listItem => {
      listItem.addEventListener(`click`, () => {
        setTimeout(() => {
          reloadHeaderLinks()
        }, 50);
      })
    });
  }
}

function urlSafe(url) {
  url = url.replaceAll(` `, `-`)
  return url
}

function pageUrl(url) {
  url = urlSafe(url)
  url = `/${url}/`
  return url
}