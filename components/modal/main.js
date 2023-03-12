function createModal(modalHtml = ``, modalTitle = title , modalSubtitle = undefined, scale = `small`, settings = {}) {
  let modal__Subtitle = modalSubtitle
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

    
    let IModalWrapper = document.createElement(`div`)
    IModalWrapper.className = `i-modal-wrapper`
    IModalWrapper.dataset.state = `opening`
    IModalWrapper.dataset.animation = `center`

    let IModalWrapper__Overlay = document.createElement(`div`)
    IModalWrapper__Overlay.className = `i-overlay`
    IModalWrapper.append(IModalWrapper__Overlay)
    
    setTimeout(() => {
      IModalWrapper__Overlay.dataset.state =  `opening`
      
      setTimeout(() => {
        IModalWrapper__Overlay.dataset.state =  `opened`
      }, 500);
    });
    
    let IModalWrapper__Modal = document.createElement(`div`)
    IModalWrapper.append(IModalWrapper__Modal)
    IModalWrapper__Modal.className = `i-modal ${modalClasses}`
    IModalWrapper__Modal.attributes = attributes

    let IModalWrapper__Modal__Header = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Header)
    IModalWrapper__Modal__Header.className = `header`
    IModalWrapper__Modal__Header.innerHTML = `
    <div>
      <p class="title">${modalTitle}</p>
      ${modalSubtitle}
    </div>
    `

    let IModalWrapper__Modal__Header__CloseButton = document.createElement(`button`)
    IModalWrapper__Modal__Header.append(IModalWrapper__Modal__Header__CloseButton)
    IModalWrapper__Modal__Header__CloseButton.innerText = `Close`
    IModalWrapper__Modal__Header__CloseButton.className = `close-button mdi mdi-close-thick`
    IModalWrapper__Modal__Header__CloseButton.title = `[ESC] Close`
    IModalWrapper__Modal__Header__CloseButton.addEventListener(`click`, () => {
      closeModal(IModalWrapper)
    })

    let IModalWrapper__Modal__Main = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Main)
    IModalWrapper__Modal__Main.className = `main`
    IModalWrapper__Modal__Main.innerHTML = modalHtml

    if (scale === `fullscreen`) {
      IModalWrapper.dataset.animation = `bottom`
    }

    if (settings.animation != undefined) {
      IModalWrapper.dataset.animation = settings.animation
    }

    document.body.append(IModalWrapper)

    setTimeout(() => {
      IModalWrapper.dataset.state = `opened`
    }, 500);

    return {
      title: modalTitle,
      subtitle: modal__Subtitle,
      scale: scale,
      modal: IModalWrapper,
      header: IModalWrapper__Modal__Header,
      main: IModalWrapper__Modal__Main
    }
  }
}

function closeModal(modal) {
  if (modal != undefined && modal != null && modal.dataset.state === `opened`) {
    modal.dataset.state =  `closing`

    if (modal.dataset.reload === ``) {
      location.reload()
    }

    setTimeout(() => {
      modal.dataset.state =  `closed`
      modal.remove()
    }, 500);

    let overlay = modal.querySelector(`div.i-overlay`)

    if (overlay != null) {
      overlay.dataset.state = `closing`
  
      setTimeout(() => {
        overlay.dataset.state = `closed`
        overlay.remove()
      }, 500);
    }
  }
}

document.addEventListener(`mouseup`, (e) => {
  console.log(e)
  if (e.target.className === `i-overlay`) {
    closeModal(Array.from(document.querySelectorAll(`.i-modal-wrapper`)).reverse()[0])
  }
})

document.addEventListener(`keyup`, (e) => {
  if (e.key === `Escape`) {
    closeModal(Array.from(document.querySelectorAll(`.i-modal-wrapper`)).reverse()[0])
  }
})
