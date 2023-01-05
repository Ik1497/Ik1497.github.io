document.body.insertAdjacentHTML(`afterbegin`, `<header class="header-primary"><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Streamer.bot Actions</p><p class="description">By Ik1497</p></div></div><aside><button class="mdi mdi-cog settings"></button></aside></header>`)

document.querySelector(`header.header-primary aside .settings`).addEventListener(`click`, function () {
    let modalContents = `<p>The settings below won't work currently, they're coming soon</p><p><input type="checkbox" id="cb-show-scrollbar"> <label for="cb-show-scrollbar">Shows Scrollbar</label><br><input type="checkbox" id="cb-lightmode"> <label for="cb-lightmode">Enable lightmode</label></p>`
    let modalBase = `<div class="website-settings-modal"><header><div class="main-info"><img src="/assets/images/favicon.png" alt="Header logo"><div class="info"><p class="name">Website Settings</p><p class="description">Streamer.bot Actions</p></div></div><aside><button class="close-button mdi mdi-close"></button></aside></header><div class="website-settings-modal-contents">${modalContents}</div></div>`
    document.body.insertAdjacentHTML(`afterbegin`, modalBase);

    document.querySelector(`.website-settings-modal header aside .close-button`).addEventListener(`click`, function () {
        document.querySelector(`.website-settings-modal`).parentNode.removeChild(document.querySelector(`.website-settings-modal`))
    })
})

