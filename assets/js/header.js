document.body.insertAdjacentHTML(`afterbegin`, `<header class="header-primary"><a href="/"><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Streamer.bot Actions</p><p class="description">By Ik1497</p></div></div></a><aside><button class="mdi mdi-cog settings" title="Settings" aria-label="Settings"></button></aside></header>`)

document.querySelector(`header.header-primary aside .settings`).addEventListener(`click`, function () {
    let checked = ``
    let setting__dropdown = `<div class="dropdown" data-dropdown="theme-selector"><div class="dropdown__title"><p class="dropdown__title-name">Theme</p></div><div class="dropdown__item-section"><button class="dropdown__current-item"><p class="dropdown__current-item-name"></p></button><div class="dropdown__items"><button class="dropdown__items-item" onclick="localStorage.setItem('websiteSettings__theme', 'auto'); settings__reloadDropdowns();"><p class="dropdown__items-item-name">Auto</p></button><button class="dropdown__items-item" onclick="localStorage.setItem('websiteSettings__theme', 'dark'); settings__reloadDropdowns();"><p class="dropdown__items-item-name">Dark Mode</p></button><button class="dropdown__items-item" onclick="localStorage.setItem('websiteSettings__theme', 'light'); settings__reloadDropdowns();"><p class="dropdown__items-item-name">Light Mode</p></button></div></div></div>`
    if (localStorage.getItem(`websiteSettings__scrollbar`) === `true`) {
        checked = ` checked`
    }
    let setting__scrollbar = `<p class="checkbox-wrapper"><input type="checkbox" id="setting__scrollbar" onclick="settings__updateChecboxes()" data-checkbox="scrollbar-toggler"${checked}> <label for="setting__scrollbar">Show Srollbar (WIP)</label></p>`
    checked = ``
    if (localStorage.getItem(`websiteSettings__visibilityChannel`) === `beta`) {
        checked = ` checked`
    }
    let setting__beta = `<p class="checkbox-wrapper"><input type="checkbox" id="setting__beta" onclick="settings__updateChecboxes()" data-checkbox="beta"${checked}> <label for="setting__beta">Show BETA pages, these pages may are unfinished/unusable</label></p>`
    let modalContents = `${setting__scrollbar}${setting__beta}${setting__dropdown}`
    let modalBase = `<div class="website-settings-modal"><header><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Website Settings</p><p class="description">Streamer.bot Actions</p></div></div><aside><button class="close-button mdi mdi-close"></button></aside></header><div class="website-settings-modal-contents">${modalContents}</div></div>`
    document.body.insertAdjacentHTML(`afterbegin`, modalBase);
    settings__reloadDropdowns()
    settings__reloadCheckboxes()

    document.querySelector(`.website-settings-modal header aside .close-button`).addEventListener(`click`, function () {
        document.querySelector(`.website-settings-modal`).parentNode.removeChild(document.querySelector(`.website-settings-modal`))
        location.reload()
    })
})

function settings__reloadDropdowns() {
    let dropdown__currentItemName = localStorage.getItem('websiteSettings__theme') || `dark`;
    if (dropdown__currentItemName === `dark`) dropdown__currentItemName = `Dark Mode`
    if (dropdown__currentItemName === `light`) dropdown__currentItemName = `Light Mode`
    if (dropdown__currentItemName === `auto`) dropdown__currentItemName = `Auto`

    document.querySelector('[data-dropdown="theme-selector"] .dropdown__current-item-name').innerText = dropdown__currentItemName;

    settings__reloadThemes()
}

function settings__updateChecboxes() {
    if (document.querySelector(`[data-checkbox="beta"]`).checked === true) {
        localStorage.setItem(`websiteSettings__visibilityChannel`, `beta`)
    } else {
        localStorage.setItem(`websiteSettings__visibilityChannel`, `public`)
    }
    localStorage.setItem(`websiteSettings__scrollbar`, document.querySelector(`[data-checkbox="scrollbar-toggler"]`).checked)
    reloadCheckboxes()
}

function settings__reloadCheckboxes() {
    if (localStorage.getItem(`websiteSettings__scrollbar`) === `true`) {
        document.body.style.setProperty(`--scrollbar-width`, `8px`)
        document.querySelector(`[data-checkbox="scrollbar-toggler"]`).setAttribute(`checked`, ``)
    } else {
        document.body.style.setProperty(`--scrollbar-width`, `0px`)
        document.querySelector(`[data-checkbox="scrollbar-toggler"]`).removeAttribute(`checked`)
    }
}

reloadCheckboxes()

function reloadCheckboxes() {
    if (localStorage.getItem(`websiteSettings__scrollbar`) === `true`) {
        document.body.style.setProperty(`--scrollbar-width`, `8px`)
    } else {
        document.body.style.setProperty(`--scrollbar-width`, `0px`)
    }
}

defaultSettings()

function defaultSettings() {
    if (localStorage.getItem(`websiteSettings__theme`) === null) {
        localStorage.setItem(`websiteSettings__theme`, `dark`)
    }
    if (localStorage.getItem(`websiteSettings__visibilityChannel`) === null) {
        localStorage.setItem(`websiteSettings__visibilityChannel`, `public`)
    }
    if (localStorage.getItem(`websiteSettings__scrollbar`) === null) {
        localStorage.setItem(`websiteSettings__scrollbar`, `false`)
    }
}
