function createModal(modalHtml = ``, modalTitle = `Streamer.bot Actions` , modalSubtitle = undefined, scale = `small`, settings = {}) {
  let modal__Subtitle = modalSubtitle
  let modalUUID = btoa(((modalTitle + modal__Subtitle + modalHtml).trim().replaceAll(` `, ``).replaceAll(`\n`, ``)).replace(/[^a-zA-Z0-9]/g, ``))

  if (document.body.getAttribute(`modal-state`) != `opened` && document.body.getAttribute(`modal-state`) != `opening`) {
    if (modalSubtitle != undefined || modalSubtitle != null) {
      modalSubtitle = `<p class="i-modal-header__subtitle">${modalSubtitle}</p>`
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
    IModalWrapper.dataset.uuid = modalUUID

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

    if (settings?.headerPrependIcon != null && settings?.headerPrependIcon != undefined) {
      if (settings?.headerPrependIcon.startsWith(`mdi:`)) {
        settings.headerPrependIcon = `<div class="i-modal-header__prepend-icon ${settings?.headerPrependIcon.replace(`mdi:`, `mdi mdi-`)}"></div>`
      }
    } else {
      settings.headerPrependIcon = ``
    }

    let IModalWrapper__Modal__Header = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Header)
    IModalWrapper__Modal__Header.className = `i-modal-header`
    IModalWrapper__Modal__Header.innerHTML = `
    <div class="i-modal-header__info-wrapper">
      ${settings?.headerPrependIcon}
      <div class="i-modal-header__info">
        <p class="i-modal-header__title">${modalTitle}</p>
        ${modalSubtitle}
      </div>
    </div>
    `

    let IModalWrapper__Modal__Header__CloseButton = document.createElement(`button`)
    IModalWrapper__Modal__Header.append(IModalWrapper__Modal__Header__CloseButton)
    IModalWrapper__Modal__Header__CloseButton.innerText = `Close`
    IModalWrapper__Modal__Header__CloseButton.className = `i-modal-header__close-button mdi mdi-close-thick`
    IModalWrapper__Modal__Header__CloseButton.title = `[ESC] Close`
    IModalWrapper__Modal__Header__CloseButton.addEventListener(`click`, () => {
      closeModal(IModalWrapper)
    })

    let IModalWrapper__Modal__Main = document.createElement(`div`)
    IModalWrapper__Modal.append(IModalWrapper__Modal__Main)
    IModalWrapper__Modal__Main.className = `i-modal-main`
    IModalWrapper__Modal__Main.innerHTML = modalHtml

    let returnData = {
      title: modalTitle,
      subtitle: modal__Subtitle,
      scale: scale,
      modal: IModalWrapper,
      header: IModalWrapper__Modal__Header,
      main: IModalWrapper__Modal__Main
    }

    if (scale === `submit` || settings?.footerHtml != undefined || settings?.footerButtons != undefined) {
      let footerHtml = ``
      if (settings?.footerHtml != undefined) footerHtml = settings?.footerHtml

      let IModalWrapper__Modal__Footer = document.createElement(`div`)
      IModalWrapper__Modal.append(IModalWrapper__Modal__Footer)
      IModalWrapper__Modal__Footer.className = `i-modal-footer`
      IModalWrapper__Modal__Footer.innerHTML = footerHtml
      returnData.footer = IModalWrapper__Modal__Footer

      if (settings?.footerType != undefined) {
        IModalWrapper__Modal__Footer.dataset.type = settings?.footerType
      }

      if (scale === `submit` || settings?.footerButtons != undefined) {
        let IModalWrapper__Modal__Main__Submit = document.createElement(`div`)
        IModalWrapper__Modal__Footer.append(IModalWrapper__Modal__Main__Submit)
        IModalWrapper__Modal__Main__Submit.className = `i-modal-footer__buttons`

        if (settings?.footerButtons != undefined) {
          returnData.onFooterButtonPress = (id) => {}

          if (typeof settings?.footerButtons === `object`) {
            settings?.footerButtons.forEach(footerButton => {
              if (footerButton.type === `theme`) {
                IModalWrapper__Modal__Main__Submit.innerHTML += `
                <button class="i-modal-footer-buttons__theme" data-id="${footerButton.id}"${footerButton?.closeModal != undefined ? ` data-close-modal` : ``}${footerButton?.disabled ? ` disabled` : ``}>${footerButton.name}</button>
                `
              } else {
                IModalWrapper__Modal__Main__Submit.innerHTML += `
                <button class="i-modal-footer-buttons__plain" data-id="${footerButton.id}"${footerButton?.closeModal != undefined ? ` data-close-modal` : ``}${footerButton?.disabled ? ` disabled` : ``}>${footerButton.name}</button>
                `
              }
            });

            IModalWrapper__Modal__Main__Submit.querySelectorAll(`[data-id]`).forEach(footerButton => {
              footerButton.addEventListener(`click`, () => {
                if (footerButton.dataset.closeModal != undefined) {
                  closeModal(IModalWrapper)
                } else {
                  returnData.onFooterButtonPress(footerButton.dataset.id)
                }
              })
            });
          }
        }

        if (scale === `submit`) {
          returnData.onClose = () => {}
          returnData.onSubmit = () => {}

          let IModalWrapper__Modal__Main__Submit__Close = document.createElement(`button`)
          IModalWrapper__Modal__Main__Submit.append(IModalWrapper__Modal__Main__Submit__Close)
          IModalWrapper__Modal__Main__Submit__Close.className = `i-modal-footer-buttons__plain`
          IModalWrapper__Modal__Main__Submit__Close.innerText = `Cancel`
          IModalWrapper__Modal__Main__Submit__Close.addEventListener(`click`, () => {
            returnData.onClose()
            closeModal(IModalWrapper)
          })
          
          let IModalWrapper__Modal__Main__Submit__Submit = document.createElement(`button`)
          IModalWrapper__Modal__Main__Submit.append(IModalWrapper__Modal__Main__Submit__Submit)
          IModalWrapper__Modal__Main__Submit__Submit.className = `i-modal-footer-buttons__theme`
          IModalWrapper__Modal__Main__Submit__Submit.innerText = settings?.submitTitle != undefined ? settings?.submitTitle : `Submit`
          IModalWrapper__Modal__Main__Submit__Submit.addEventListener(`click`, () => {
            returnData.onSubmit()
            closeModal(IModalWrapper)
          })
        }
      }
    }

    if (scale === `fullscreen`) {
      IModalWrapper.dataset.animation = `bottom`
    }

    if (settings?.animation != undefined) {
      IModalWrapper.dataset.animation = settings.animation
    }

    if (settings?.props != undefined) {
      if (typeof settings?.props === `object`) {
        Object.entries(settings?.props).forEach(prop => {
          IModalWrapper.style.setProperty(prop[0], prop[1])
        });
      }
    }

    if (settings?.overlayProps != undefined) {
      if (typeof settings?.overlayProps === `object`) {
        Object.entries(settings?.overlayProps).forEach(prop => {
          IModalWrapper__Overlay.style.setProperty(prop[0], prop[1])
        });
      }
    }

    document.body.append(IModalWrapper)
    document.activeElement.blur()

    setTimeout(() => {
      IModalWrapper.dataset.state = `opened`
    }, 500);

    return returnData
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
  if (e.target.className === `i-overlay`) {
    closeModal(Array.from(document.querySelectorAll(`.i-modal-wrapper`)).reverse()[0])
  }
})

document.addEventListener(`keyup`, (e) => {
  if (e.key === `Escape`) {
    closeModal(Array.from(document.querySelectorAll(`.i-modal-wrapper`)).reverse()[0])
  }
})
