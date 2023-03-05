///////////////
// UNLOADED ///
///////////////

class IUnloadedTabs extends HTMLElement {
  constructor() {
    super()
    let tabsHeaderNavigation = ``
    let tabsBodyTabs = ``

    Array.from(this.children).forEach((tab, id) => {
      if (tab.getAttribute(`data-tab`) != null) {
        tabsHeaderNavigation += `
        <i-tabs-header-navigation-list-item data-id="${id}">
          <button is="i-tabs-header-navigation-list-item-button">${tab.getAttribute(`data-tab`)}</button>
        </i-tabs-header-navigation-list-item>
        `

        tabsBodyTabs += `
        <i-tabs-body-tab data-page="${tab.getAttribute(`data-tab`)}" data-id="${id}">
          <i-tabs-body-tab-content>${tab.innerHTML}</i-tabs-body-tab-content>
        </i-tabs-body-tab>
        `
      }
    });

    let ITabsWrapperElement = document.createElement(`i-tabs-wrapper`)


    Array.from(this.attributes).forEach(attribute => {
      ITabsWrapperElement.setAttribute(attribute.name, attribute.value)
    });

    let ITabsElement = document.createElement(`i-tabs`)
    ITabsWrapperElement.append(ITabsElement)

    ITabsElement.innerHTML = `
    <i-tabs-header>
      <i-tabs-header-navigation>
        <i-tabs-header-navigation-list>${tabsHeaderNavigation}</i-tabs-header-navigation-list>
        <i-tabs-header-navigation-indicator></i-tabs-header-navigation-indicator>
      </i-tabs-header-navigation>
    </i-tabs-header>


    <i-tabs-body>
      <i-tabs-body-tabs>${tabsBodyTabs}</i-tabs-body-tabs>
    </i-tabs-body>
    `

    this.replaceWith(ITabsWrapperElement)
  }
}

class IUnloadedTabsTab extends HTMLElement {
  constructor() {
    super()
  }
}

//////////////
/// LOADED ///
//////////////

// General Elements

class ITabsWrapper extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabs extends HTMLElement {
  constructor() {
    super()
    this.querySelector(`i-tabs-header i-tabs-header-navigation-list i-tabs-header-navigation-list-item`)?.setAttribute(`data-active`, ``)
    this.querySelector(`i-tabs-header i-tabs-header-navigation-indicator`).style.left = `${this.querySelector(`i-tabs-header i-tabs-header-navigation-list i-tabs-header-navigation-list-item`).offsetLeft}px`
    this.querySelector(`i-tabs-header i-tabs-header-navigation-indicator`).style.width = `${this.querySelector(`i-tabs-header i-tabs-header-navigation-list i-tabs-header-navigation-list-item`).scrollWidth}px`
    this.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab`).setAttribute(`data-state`, `active`)
    // this.querySelector(`i-tabs-body i-tabs-body-tabs`).style.maxHeight = `${this.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab`).scrollHeight}px`
    this.querySelector(`i-tabs-body i-tabs-body-tabs`).style.minHeight = `${this.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab`).scrollHeight}px`
  }
}

// Header Elements

class ITabsHeader extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsHeaderNavigation extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsHeaderNavigationList extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsHeaderNavigationIndicator extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsHeaderNavigationListItem extends HTMLElement {
  constructor() {
    super()
  }
}


class ITabsHeaderNavigationListItemButton extends HTMLButtonElement {
  constructor() {
    super()
    this.addEventListener(`click`, () => {
      let indicator = this.parentNode.parentNode.parentNode.querySelector(`i-tabs-header-navigation-indicator`)
      indicator.style.left = `${this.parentNode.offsetLeft}px`
      indicator.style.width = `${this.parentNode.scrollWidth}px`

      this.parentNode.parentNode.querySelectorAll(`[data-active]`).forEach(activeElement => {
        activeElement.removeAttribute(`data-active`)
      });

      this.parentNode.setAttribute(`data-active`, ``)

      let newBodyTab = this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-id="${this.parentNode.getAttribute(`data-id`)}"]`)
      let currentBodyTab = this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="active"], i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="becoming-active"]`)
      let bodyTabs = this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="active"], i-tabs-body i-tabs-body-tabs`)

      this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll(`i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="active"], i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="becoming-pre-active"], i-tabs-body i-tabs-body-tabs i-tabs-body-tab[data-state="becoming-active"]`).forEach(tab => {
        tab.setAttribute(`data-state`, `becoming-inactive`)

        tab.addEventListener(`transitionend`, () => {
          tab.setAttribute(`data-state`, `inactive`)
        })
      });

      if (newBodyTab != null) {
        newBodyTab.setAttribute(`data-state`, `becoming-pre-active`)
        // bodyTabs.style.maxHeight = `${newBodyTab.scrollHeight}px`
        bodyTabs.style.minHeight = `${newBodyTab.scrollHeight}px`

        if (newBodyTab.getAttribute(`data-id`) < currentBodyTab.getAttribute(`data-id`)) {
          newBodyTab.setAttribute(`data-direction`, `left`)
          currentBodyTab.setAttribute(`data-direction`, `right`)
        } else {
          newBodyTab.setAttribute(`data-direction`, `right`)
          currentBodyTab.setAttribute(`data-direction`, `left`)
        }

        setTimeout(() => {
          newBodyTab.setAttribute(`data-state`, `becoming-active`)
          
          newBodyTab.addEventListener(`transitionend`, () => {
            newBodyTab.setAttribute(`data-state`, `active`)
  
            if (newBodyTab.getAttribute(`data-direction`) != null) {
              newBodyTab.removeAttribute(`data-direction`)
            }
          })
        });
      }
    })
  }
}

// Body Elements

class ITabsBody extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsBodyTabs extends HTMLElement {
  constructor() {
    super()
  }
}

class ITabsBodyTab extends HTMLElement {
  constructor() {
    super()
    if (this.getAttribute(`data-state`) === null) {
      this.setAttribute(`data-state`, `inactive`)
    }

    const resizeObserver = new ResizeObserver(entries => 
      console.log(entries[0])
    )
    
    resizeObserver.observe(this)
  }
}

class ITabsBodyTabContent extends HTMLElement {
  constructor() {
    super()
  }
}

//////////////////////////////
/// DEFINE CUSTOM ELEMENTS ///
//////////////////////////////

customElements.define("i-unloaded-tabs", IUnloadedTabs)
customElements.define("i-unloaded-tabs-tab", IUnloadedTabsTab)


customElements.define("i-tabs-wrapper", ITabsWrapper)
customElements.define("i-tabs", ITabs)

customElements.define("i-tabs-header", ITabsHeader)
customElements.define("i-tabs-header-navigation", ITabsHeaderNavigation)
customElements.define("i-tabs-header-navigation-list", ITabsHeaderNavigationList)
customElements.define("i-tabs-header-navigation-list-item", ITabsHeaderNavigationListItem)
customElements.define("i-tabs-header-navigation-list-item-button", ITabsHeaderNavigationListItemButton, { extends: "button" })
customElements.define("i-tabs-header-navigation-indicator", ITabsHeaderNavigationIndicator)

customElements.define("i-tabs-body", ITabsBody)
customElements.define("i-tabs-body-tabs", ITabsBodyTabs)
customElements.define("i-tabs-body-tab", ITabsBodyTab)
customElements.define("i-tabs-body-tab-content", ITabsBodyTabContent)
