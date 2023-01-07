document.body.insertAdjacentHTML(`afterbegin`, `<header class="header-primary"><a href="/"><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Streamer.bot Actions</p><p class="description">By Ik1497</p></div></div></a><aside><button class="mdi mdi-cog settings" title="Settings" aria-label="Settings"></button></aside></header>`)

document.querySelector(`header.header-primary aside .settings`).addEventListener(`click`, function () {
    let setting__dropdown = `<div class="dropdown" data-dropdown="theme-selector"><div class="dropdown__title"><p class="dropdown__title-name">Theme</p></div><div class="dropdown__item-section"><button class="dropdown__current-item"><p class="dropdown__current-item-name"></p></button><div class="dropdown__items"><button class="dropdown__items-item" onclick="localStorage.setItem('websiteSettings__theme', 'dark'); reloadDropdowns();"><p class="dropdown__items-item-name">Dark Mode</p></button><button class="dropdown__items-item" onclick="localStorage.setItem('websiteSettings__theme', 'light'); reloadDropdowns();"><p class="dropdown__items-item-name">Light Mode</p></button></div></div></div>`
    let modalContents = `${setting__dropdown}`
    let modalBase = `<div class="website-settings-modal"><header><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Website Settings</p><p class="description">Streamer.bot Actions</p></div></div><aside><button class="close-button mdi mdi-close"></button></aside></header><div class="website-settings-modal-contents">${modalContents}</div></div>`
    document.body.insertAdjacentHTML(`afterbegin`, modalBase);
    reloadDropdowns()

    document.querySelector(`.website-settings-modal header aside .close-button`).addEventListener(`click`, function () {
        document.querySelector(`.website-settings-modal`).parentNode.removeChild(document.querySelector(`.website-settings-modal`))
    })
})

function reloadDropdowns() {
    let dropdown__currentItemName = localStorage.getItem('websiteSettings__theme') || `dark`;
    if (dropdown__currentItemName === `dark`) dropdown__currentItemName = `Dark Mode`
    if (dropdown__currentItemName === `light`) dropdown__currentItemName = `Light Mode`

    document.querySelector('[data-dropdown="theme-selector"] .dropdown__current-item-name').innerText = dropdown__currentItemName;

    reloadThemes()
}