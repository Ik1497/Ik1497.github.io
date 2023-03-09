document.body.insertAdjacentHTML(`afterbegin`, `
<header class="header-primary">
  <a href="/">
    <div class="main-info">
      <img src="/assets/images/favicon.png" alt="Header logo">
      <div class="info">
        <p class="name">Streamer.bot Actions</p>
        <p class="description">By Ik1497</p>
      </div>
    </div>
  </a>
  <aside>
    <button class="mdi mdi-cog settings" title="Settings" aria-label="Settings"></button>
  </aside>
</header>
`)

document.querySelector(`header.header-primary aside .settings`).addEventListener(`click`, function () {
  const websiteModal = createModal(``, `Website Settings`, null, `medium`, {})
  
  let websiteModal__darkMode = document.createElement(`div`)
  websiteModal.main.append(websiteModal__darkMode)
  websiteModal__darkMode.innerHTML = `
  <div>
    <input type="radio" id="WebsiteSettings__RadioButtons__DarkMode" name="WebsiteSettings__RadioButtons__Theme" value="Dark Mode"${localStorage.getItem(`websiteSettings__theme`) === `dark` ? `checked` : ``}>
    <label for="WebsiteSettings__RadioButtons__DarkMode">Dark Mode</label>
  </div>
  
  <div>
    <input type="radio" id="WebsiteSettings__RadioButtons__LightMode" name="WebsiteSettings__RadioButtons__Theme" value="Light Mode"${localStorage.getItem(`websiteSettings__theme`) === `light` ? `checked` : ``}>
    <label for="WebsiteSettings__RadioButtons__LightMode">Light Mode</label>
  </div>
  
  <div>
    <input type="radio" id="WebsiteSettings__RadioButtons__Auto" name="WebsiteSettings__RadioButtons__Theme" value="Auto"${localStorage.getItem(`websiteSettings__theme`) === `auto` ? `checked` : ``}>
    <label for="WebsiteSettings__RadioButtons__Auto">Auto</label>
  </div>
  `

  websiteModal__darkMode.querySelectorAll(`input`).forEach(button => {
    button.addEventListener(`click`, () => {
      if (button.id === `WebsiteSettings__RadioButtons__DarkMode`) {
        localStorage.setItem(`websiteSettings__theme`, `dark`)
        document.body.dataset.theme = `dark`
      } else if (button.id === `WebsiteSettings__RadioButtons__LightMode`) {
        localStorage.setItem(`websiteSettings__theme`, `light`)
        document.body.dataset.theme = `light`
      } else if (button.id === `WebsiteSettings__RadioButtons__Auto`) {
        localStorage.setItem(`websiteSettings__theme`, `auto`)
        document.body.dataset.theme = `auto`
      }
    })
  });
})
