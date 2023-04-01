class ITabs extends HTMLElement {
  constructor() {
    super()

    let ITabsWrapper = document.createElement(`div`)
    ITabsWrapper.className = `i-tabs-wrapper`

    let ITabsContent = document.createElement(`div`)
    ITabsWrapper.append(ITabsContent)
    ITabsContent.className = `i-tabs-content`

    this.querySelectorAll(`i-tab`).forEach(tab => {
      if (!tab.dataset.tab) {
        tab.remove()
        return
      }

      let ITabsContent__Tab = document.createElement(`div`)
      ITabsContent.append(ITabsContent__Tab)
      ITabsContent__Tab.className = `i-tabs-content-tab`

      let ITabsContent__Tab__Title = document.createElement(`div`)
      ITabsContent__Tab.append(ITabsContent__Tab__Title)
      ITabsContent__Tab__Title.className = `i-tabs-content-tab-title`
      ITabsContent__Tab__Title.innerHTML = tab.dataset.tab

      let ITabsContent__Tab__Content = document.createElement(`div`)
      ITabsContent__Tab.append(ITabsContent__Tab__Content)
      ITabsContent__Tab__Content.className = `i-tabs-content-tab-content`
      ITabsContent__Tab__Content.innerHTML = tab.innerHTML
    });

    this.replaceWith(ITabsWrapper)
  }
}

class ITab extends HTMLElement {
  constructor() {
    super()
  }
}

customElements.define("i-tabs", ITabs)
customElements.define("i-tab", ITab)
