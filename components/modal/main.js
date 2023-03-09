function createModal(modalHtml = ``, modalTitle = title , modalSubtitle = undefined, scale = `small`, settings = {}) {
  document.querySelectorAll(`.i-modal-wrapper`).forEach(settingsModalAlt => {
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
      modalClasses += ` modal-animation--animate-from-bottom`
    }

    let IModalWrapper = document.createElement(`div`)
    document.body.prepend(IModalWrapper)
    IModalWrapper.className = `i-modal-wrapper`
    
    let IModalWrapper__Modal = document.createElement(`div`)
    IModalWrapper.append(IModalWrapper__Modal)
    IModalWrapper__Modal.className = `i-modal ${modalClasses}`
    IModalWrapper__Modal.attributes = attributes

    let IModalWrapper__Modal__Main = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Main)
    IModalWrapper__Modal__Main.className = `main`
    IModalWrapper__Modal__Main.innerHTML = `
    ${modalHtml}
    <div class="i-modal__spacer"></div>
    `

    let IModalWrapper__Modal__Header = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Header)
    IModalWrapper__Modal__Header.className = `header`
    IModalWrapper__Modal__Header.innerHTML = `
    <div>
      <p class="title">${modalTitle}</p>
      ${modalSubtitle}
    </div>
    <button
      class="close-button mdi mdi-close-thick" 
      title="[ESC] Close"
      onclick="closeModal()"
    >Close</button>
    `

    document.body.setAttribute(`data-modal-state`, `opening`)
    setTimeout(() => {
      document.body.setAttribute(`data-modal-state`, `opened`)
    }, 500);

    return {
      title: modalTitle,
      subtitle: modalSubtitle,
      scale: scale,
      modal: IModalWrapper__Modal,
      header: IModalWrapper__Modal__Header,
      main: IModalWrapper__Modal__Main
    }
  }
}

function closeModal() {
  if (document.body.getAttribute(`data-modal-state`) === `opened`) {
    document.body.setAttribute(`data-modal-state`, `closing`)
    if (document.querySelector(`.i-modal-wrapper`).getAttribute(`data-reload`) === ``) {
      location.reload()
    }
    setTimeout(() => {
      document.body.setAttribute(`data-modal-state`, `closed`)
      document.querySelectorAll(`.i-modal-wrapper`).forEach(settingsModalAlt => {
        settingsModalAlt.remove()
      });
    }, 500);
  }
}

document.addEventListener(`mouseup`, (e) => {
  if (e.target.tagName === `BODY`) {
    closeModal()
  }
})

document.addEventListener(`keyup`, (e) => {
  if (e.key === `Escape`) {
    closeModal()
  }
})
