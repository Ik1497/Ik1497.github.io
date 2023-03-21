function createSelect(label, options, settings) {
  let returnData = {}

  let ISelect__Wrapper = document.createElement(`div`)
  ISelect__Wrapper.className = `i-select-wrapper`
  ISelect__Wrapper.dataset.state = `closed`
  returnData.element = ISelect__Wrapper
  
  let ISelect = document.createElement(`div`)
  ISelect__Wrapper.append(ISelect)
  ISelect.className = `i-select`

  // SELECT ACTIVE
  
  let ISelect__Main__Wrapper = document.createElement(`button`)
  ISelect.append(ISelect__Main__Wrapper)
  ISelect__Main__Wrapper.className = `i-select-main-wrapper`

  ISelect__Main__Wrapper.addEventListener(`click`, () => {
    if (ISelect__Wrapper.dataset.state === `open`) {
      ISelect__Wrapper.dataset.state = `closed`
    } else {
      ISelect__Wrapper.dataset.state = `open`
    }
  })

  let ISelect__Title = document.createElement(`div`)
  ISelect__Main__Wrapper.append(ISelect__Title)
  ISelect__Title.className = `i-select-title`
  ISelect__Title.innerText = label

  let ISelect__Active = document.createElement(`div`)
  ISelect__Main__Wrapper.append(ISelect__Active)
  ISelect__Active.className = `i-select-active`

  // OPTIONS

  let ISelect__Options__Wrapper = document.createElement(`div`)
  ISelect.append(ISelect__Options__Wrapper)
  ISelect__Options__Wrapper.className = `i-select-options-wrapper`

  
  options.forEach(option => {
    let ISelect__Option__Wrapper = document.createElement(`div`)
    ISelect__Options__Wrapper.append(ISelect__Option__Wrapper)
    ISelect__Option__Wrapper.className = `i-select-option-wrapper`
    
    let ISelect__Option = document.createElement(`button`)
    ISelect__Option__Wrapper.append(ISelect__Option)
    ISelect__Option.className = `i-select-option`
    ISelect__Option.innerText = option.name
    ISelect__Option.dataset.value = option.value

    ISelect__Option.addEventListener(`click`, () => {
      ISelect__Active.innerText = option.name
      ISelect__Active.dataset.value = option.value

      ISelect__Wrapper.dataset.activeName = option.name
      ISelect__Wrapper.dataset.activeValue = option.value

      ISelect__Options__Wrapper.querySelectorAll(`.i-select-option[data-active="true"]`).forEach(oldActive => {
        oldActive.removeAttribute(`data-active`)
      });
      ISelect__Option.dataset.active = `true`
    })
  });

  return returnData
}
