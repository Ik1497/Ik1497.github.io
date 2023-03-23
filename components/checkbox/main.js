function ICreateCheckbox(label, options = {}) {
  let returnObject = {}

  let checkboxesCount = document.querySelectorAll(`input[type="checkbox"]`).length
  let checkboxId = `i-checkbox-${btoa(`${Math.round(Math.random() * (999999999 - 111111111) + 111111111)}` + `${checkboxesCount}` + `${Math.round(Math.random() * (999999999 - 111111111) + 111111111)}`)}`
  returnObject.id = checkboxId

  let ICheckbox__Wrapper = document.createElement(`div`)
  ICheckbox__Wrapper.className = `i-checkbox-wrapper`
  ICheckbox__Wrapper.dataset.id = checkboxId
  returnObject.element = ICheckbox__Wrapper

  if (options.checked === true) {
    ICheckbox__Wrapper.dataset.checked = `true`
  } else {
    ICheckbox__Wrapper.dataset.checked = `false`
  }
  
  let ICheckbox__Wrapper__Input__Wrapper = document.createElement(`div`)
  ICheckbox__Wrapper__Input__Wrapper.className = `i-checkbox-input-wrapper`
  ICheckbox__Wrapper.append(ICheckbox__Wrapper__Input__Wrapper)
  
  let ICheckbox__Wrapper__Icon = document.createElement(`div`)
  ICheckbox__Wrapper__Input__Wrapper.append(ICheckbox__Wrapper__Icon)
  ICheckbox__Wrapper__Icon.className = `i-checkbox-icon`

  if (ICheckbox__Wrapper.dataset.checked === `true`) {
    setIconToChecked()
  } else {
    setIconToDefault()
  }
  
  let ICheckbox__Wrapper__Input = document.createElement(`input`)
  ICheckbox__Wrapper__Input__Wrapper.append(ICheckbox__Wrapper__Input)
  ICheckbox__Wrapper__Input.className = `i-checkbox-input`
  ICheckbox__Wrapper__Input.type = `checkbox`
  ICheckbox__Wrapper__Input.id = checkboxId
  returnObject.onStateChange = (state, e) => {}

  ICheckbox__Wrapper__Input.addEventListener(`change`, (e) => {
    returnObject.onStateChange(ICheckbox__Wrapper__Input.checked, e)
    ICheckbox__Wrapper.dataset.checked = ICheckbox__Wrapper__Input.checked

    if (ICheckbox__Wrapper__Input.checked === true) {
      setIconToChecked()
    } else {
      setIconToDefault()
    }
  })

  function setIconToChecked() {
    ICheckbox__Wrapper__Icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="var(--i-checkbox-icon-color, #ffffff)" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>`
  }

  function setIconToDefault() {
    ICheckbox__Wrapper__Icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="var(--i-checkbox-icon-color, #ffffff)" d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14Z"/></svg>`
  }
  
  let ICheckbox__Wrapper__Label = document.createElement(`label`)
  ICheckbox__Wrapper.append(ICheckbox__Wrapper__Label)
  ICheckbox__Wrapper__Label.className = `i-checkbox-label`
  ICheckbox__Wrapper__Label.setAttribute(`for`, checkboxId)
  ICheckbox__Wrapper__Label.innerHTML = label
  return returnObject
}
