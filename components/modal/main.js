function createModal(modalHtml = ``, modalTitle = title, modalSubtitle = undefined, scale = `small`, settings = {}) {
  document.querySelectorAll(`.modal-wrapper`).forEach(settingsModalAlt => {
    settingsModalAlt.remove()
  });
  if (document.body.getAttribute(`modal-state`) != `opened` && document.body.getAttribute(`modal-state`) != `opening`) {
    if (modalSubtitle != undefined || modalSubtitle != null) {
      modalSubtitle = `<p class="subtitle">${modalSubtitle}</p>`
    } else {
      modalSubtitle = ``
    }

    let modalClasses = `${scale}`
    let attributes = ``

    if (settings.reload === true) {
      attributes = `data-reload `
    }

    if (settings.animation === `fromBottom` || scale === `fullscreen` && settings.animation === undefined) {
      modalClasses += ` modal-animation animate-from-bottom`
    }
  
    document.body.insertAdjacentHTML(`afterbegin`, `
    <div class="modal-wrapper">
      <div class="modal ${modalClasses}"${attributes}>
        <div class="header">
          <div>
            <h2 class="title">${modalTitle}</h2>
            ${modalSubtitle}
          </div>
          <button
            class="close-button mdi mdi-close-thick" 
            title="[ESC] Close"
            onclick="closeModal()"
          >Close</button>
        </div>
        <div class="main">
          ${modalHtml}
        </div>
      </div>
    </div>
    `)

    document.body.setAttribute(`data-modal-state`, `opening`)
    setTimeout(() => {
      document.body.setAttribute(`data-modal-state`, `opened`)
    }, 500);
  }
}

function closeModal() {
  if (document.body.getAttribute(`data-modal-state`) === `opened`) {
    document.body.setAttribute(`data-modal-state`, `closing`)
    if (document.querySelector(`.modal-wrapper`).getAttribute(`data-reload`) === ``) {
      location.reload()
    }
    setTimeout(() => {
      document.body.setAttribute(`data-modal-state`, `closed`)
      document.querySelectorAll(`.modal-wrapper`).forEach(settingsModalAlt => {
        settingsModalAlt.remove()
      });
    }, 500);
  }
}

document.addEventListener(`mousedown`, (e) => {
  if (e.target.tagName === `BODY`) {
    closeModal()
  }
})

document.addEventListener(`keyup`, (e) => {
  if (e.key === `Escape`) {
    closeModal()
  }
})