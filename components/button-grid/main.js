/////////////////////////
/// COMPONENT CLASSES ///
/////////////////////////

class IButtonGrid extends HTMLElement {
  constructor() {
    super()
    let buttonGrid = document.createElement(`div`)
    buttonGrid.className = `i-button-grid`
    buttonGrid.innerHTML = this.innerHTML

    this.replaceWith(buttonGrid)
  }
}

class IButtonGridItem extends HTMLElement {
  constructor() {
    super()
    let SETTINGS = {
      type: `div`
    }

    if (this?.dataset?.type === `button`) {
      SETTINGS.type = `button`
    } else if (this?.dataset?.type === `plain` || this?.dataset?.link === undefined) {
      SETTINGS.type = `div`
    } else {
      SETTINGS.type = `a`
    }

    let buttonGridItem = document.createElement(SETTINGS.type)
    buttonGridItem.className = `i-button-grid-item`
    buttonGridItem.innerHTML = this.innerHTML
    if (SETTINGS.type === `a`) buttonGridItem.href = this?.dataset?.link || `#`

    if (this?.dataset?.icon != undefined) {
      let itemType = ``

      if (this?.dataset?.icon.startsWith(`mdi:`)) {
        itemType = `div`
      } else {
        itemType = `img`
      }

      let buttonGridIcon = document.createElement(itemType)
      buttonGridItem.append(buttonGridIcon)
      buttonGridIcon.className = `i-button-grid-item-icon`

      if (this?.dataset?.icon.startsWith(`mdi:`)) {
        buttonGridIcon.className = `i-button-grid-item-icon mdi mdi-${this?.dataset?.icon.replace(`mdi:`, ``) || `solid`}`
      } else {
        buttonGridIcon.src = this?.dataset?.icon
      }
    }

    let buttonGridTextWrapper = document.createElement(`div`)
    buttonGridItem.append(buttonGridTextWrapper)
    buttonGridTextWrapper.className = `i-button-text-wrapper`

    let buttonGridTitle = document.createElement(`p`)
    buttonGridTextWrapper.append(buttonGridTitle)
    buttonGridTitle.className = `i-button-grid-item-title`
    buttonGridTitle.innerHTML = this?.dataset?.name || `Button`

    if (this?.dataset?.description != undefined) {
      let buttonGridDescription = document.createElement(`p`)
      buttonGridTextWrapper.append(buttonGridDescription)
      buttonGridDescription.className = `i-button-grid-item-description`
      buttonGridDescription.innerHTML = this?.dataset?.description || ``
    }

    this.replaceWith(buttonGridItem)
  }
}

///////////////////////
/// CUSTOM ELEMENTS ///
///////////////////////

customElements.define("i-button-grid", IButtonGrid)
customElements.define("i-button-grid-item", IButtonGridItem)