class ExpansionPanelList extends HTMLElement {
  constructor() {
    super()
    if (this.getAttribute(`data-expansion-panel-multiple`) === null) {
      this.querySelectorAll(`i-expansion-panel-list-item`).forEach(ExpansionPanelListItem => {
        ExpansionPanelListItem.querySelector(`i-expansion-panel-list-item-header`).addEventListener(`click`, () => {
          this.querySelectorAll(`i-expansion-panel-list-item[data-expansion-state="expanded"]`).forEach(element => {
            if (this.querySelectorAll(`i-expansion-panel-list-item[data-expansion-state="expanded"]`)[0] != ExpansionPanelListItem) {
              element.setAttribute(`data-expansion-state`, `contracted`)
              element.querySelector(`i-expansion-panel-list-item-body`).style.maxHeight = `0px`
            }
          });
        })
      });
    }
  }
}

class ExpansionPanelListItem extends HTMLElement {
  constructor() {
    super()
    this.setAttribute(`data-expansion-state`, `contracted`)
  }
}

class ExpansionPanelListItemHeader extends HTMLElement {
  constructor() {
    super()
    this.addEventListener(`click`, () => {
      if (this.parentNode.getAttribute(`data-expansion-state`) === `expanded`) {
        this.parentNode.setAttribute(`data-expansion-state`, `contracted`)
        this.parentNode.querySelector(`i-expansion-panel-list-item-body`).style.maxHeight = `0px`
      } else {
        this.parentNode.setAttribute(`data-expansion-state`, `expanded`)
        this.parentNode.querySelector(`i-expansion-panel-list-item-body`).style.maxHeight = this.parentNode.querySelector(`i-expansion-panel-list-item-body`).scrollHeight + `px`
      }
    })
  }
}

class ExpansionPanelListItemHeaderContent extends HTMLElement {
  constructor() {
    super()
  }
}

class ExpansionPanelListItemHr extends HTMLElement {
  constructor() {
    super()
  }
}

class ExpansionPanelListItemSpacer extends HTMLElement {
  constructor() {
    super()
  }
}

class ExpansionPanelListItemBody extends HTMLElement {
  constructor() {
    super()
    this.style.maxHeight = `0px`
    this.prepend(document.createElement(`i-expansion-panel-list-item-hr`))
  }
}

class ExpansionPanelListItemBodyContent extends HTMLElement {
  constructor() {
    super()
    this.append(document.createElement(`i-expansion-panel-list-item-spacer`))
  }
}

customElements.define("i-expansion-panel-list", ExpansionPanelList)
customElements.define("i-expansion-panel-list-item", ExpansionPanelListItem)
customElements.define("i-expansion-panel-list-item-header", ExpansionPanelListItemHeader)
customElements.define("i-expansion-panel-list-item-header-content", ExpansionPanelListItemHeaderContent)
customElements.define("i-expansion-panel-list-item-hr", ExpansionPanelListItemHr)
customElements.define("i-expansion-panel-list-item-spacer", ExpansionPanelListItemSpacer)
customElements.define("i-expansion-panel-list-item-body", ExpansionPanelListItemBody)
customElements.define("i-expansion-panel-list-item-body-content", ExpansionPanelListItemBodyContent)