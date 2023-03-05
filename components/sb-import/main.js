//////////////
/// LOADER ///
//////////////

class ISbImportLoader extends HTMLElement {
  constructor() {
    super()

    const ISbImport__ImportCode = this.innerText.trim()

    let ISbImport__Wrapper = document.createElement(`i-sb-import-wrapper`)
    
    Array.from(this.attributes).forEach(attribute => {
      ISbImport__Wrapper.setAttribute(attribute.name, attribute.value)
    });
    
    let ISbImport__Wrapper__Import = document.createElement(`i-sb-import`)
    ISbImport__Wrapper.append(ISbImport__Wrapper__Import)

    // Actions

    let ISbImport__Wrapper__Import__Actions = document.createElement(`i-sb-import-actions`)
    ISbImport__Wrapper__Import.append(ISbImport__Wrapper__Import__Actions)
    
    let ISbImport__Wrapper__Import__Actions__ImportTitle = document.createElement(`i-sb-import-actions-title`)
    ISbImport__Wrapper__Import__Actions__ImportTitle.innerText = `Import Code`
    ISbImport__Wrapper__Import__Actions__ImportTitle.setAttribute(`data-type`, `import-title`)
    ISbImport__Wrapper__Import__Actions.append(ISbImport__Wrapper__Import__Actions__ImportTitle)

    let ISbImport__Wrapper__Import__Actions__CopyButton = document.createElement(`button`)
    ISbImport__Wrapper__Import__Actions__CopyButton.setAttribute(`is`, `i-sb-import-actions-button`)
    ISbImport__Wrapper__Import__Actions__CopyButton.innerText = `Copy`
    ISbImport__Wrapper__Import__Actions__CopyButton.addEventListener(`click`, () => {
      navigator.clipboard.writeText(ISbImport__ImportCode)
    })
    ISbImport__Wrapper__Import__Actions.append(ISbImport__Wrapper__Import__Actions__CopyButton)

    let ISbImport__Wrapper__Import__Actions__DownloadButton = document.createElement(`button`)
    ISbImport__Wrapper__Import__Actions__DownloadButton.setAttribute(`is`, `i-sb-import-actions-button`)
    ISbImport__Wrapper__Import__Actions__DownloadButton.innerText = `Download`
    ISbImport__Wrapper__Import__Actions__DownloadButton.addEventListener(`click`, () => {
      download(ISbImport__ImportCode, `import${
        ISbImport__Wrapper.getAttribute(`import-name`) != null ? `-${
          ISbImport__Wrapper.getAttribute(`import-name`).replaceAll(` `, `-`)
        }` : `` || `code`
      }.sb`)
    })
    ISbImport__Wrapper__Import__Actions.append(ISbImport__Wrapper__Import__Actions__DownloadButton)

    // Pre

    let ISbImport__Wrapper__Import__Pre = document.createElement(`pre`)
    ISbImport__Wrapper__Import.append(ISbImport__Wrapper__Import__Pre)

    let ISbImport__Wrapper__Import__Pre__Code = document.createElement(`code`)
    ISbImport__Wrapper__Import__Pre__Code.innerHTML = ISbImport__ImportCode
    ISbImport__Wrapper__Import__Pre.append(ISbImport__Wrapper__Import__Pre__Code)


    this.replaceWith(ISbImport__Wrapper)
  }
}

/////////////////
/// GENERATED ///
/////////////////

class ISbImportWrapper extends HTMLElement {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return [`import-name`, `no-margin`];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === `import-name`) {
      this.querySelector(`i-sb-import i-sb-import-actions i-sb-import-actions-title[data-type="import-title"]`).innerHTML = newValue
    }
  }
}

class ISbImport extends HTMLElement {
  constructor() {
    super()
  }
}

class ISbImportActions extends HTMLElement {
  constructor() {
    super()
  }
}

class ISbImportActionsTitle extends HTMLElement {
  constructor() {
    super()
  }
}

class ISbImportActionsItem extends HTMLElement {
  constructor() {
    super()
  }
}

class ISbImportActionsButton extends HTMLButtonElement {
  constructor() {
    super()
    this.addEventListener(`click`, (e) => {
      if (e.target.innerText === `Copy`) {
        navigator.clipboard.writeText(this.parentNode.parentNode.querySelector(`pre code`).innerText)
      } else if (e.target.innerText === `Download`) {
        download(this.parentNode.parentNode.querySelector(`pre code`).innerText, `import${
          this.parentNode.querySelector(`i-sb-import-actions-title`).innerText != null ? `-${
            this.parentNode.querySelector(`i-sb-import-actions-title`).innerText.replaceAll(` `, `-`)
          }` : `` || `code`
        }.sb`)
      }
    })
  }
}

////////////////////////
/// HELPER FUNCTIONS ///
////////////////////////

function download(text = ``, filename = `import.sb`) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.append(element);

  element.click();
  element.remove();
}

///////////////////////
/// CUSTOM ELEMENTS ///
///////////////////////

customElements.define("i-sb-import-loader", ISbImportLoader)

customElements.define("i-sb-import-wrapper", ISbImportWrapper)
customElements.define("i-sb-import", ISbImport)
customElements.define("i-sb-import-actions", ISbImportActions)
customElements.define("i-sb-import-actions-title", ISbImportActionsTitle)
customElements.define("i-sb-import-actions-item", ISbImportActionsItem)
customElements.define("i-sb-import-actions-button", ISbImportActionsButton, { extends: `button` })