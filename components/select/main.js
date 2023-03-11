class ISelect extends HTMLElement {
  constructor() {
    super()
    Array.from(this.attributes).forEach(attribute => {
      let select__name = ``
      let select__options = []
      if (attribute.name === `data-name`) {
        select__name = attribute.value.trim()
      }
      if (attribute.name === `data-options`) {
        select__options = attribute.value.trim()
      }
      if (select__options.includes(` ||--|| `)) {
        select__options = select__options.split(` ||--|| `)
        console.log(select__options)
      } else {
        select__options = []
      }

      let ISelect = document.createElement(`div`)
      this.replaceWith(ISelect)
      ISelect.className = `i-select`

      let ISelect__Title__Wrapper = document.createElement(`div`)
      ISelect.append(ISelect__Title__Wrapper)
      ISelect__Title__Wrapper.className = `i-select-title-wrapper`
      
      let ISelect__Title = document.createElement(`p`)
      ISelect__Title__Wrapper.append(ISelect__Title)
      ISelect__Title.className = `i-select-title`
      ISelect__Title.innerText = select__name

      let ISelect__Options__Wrapper = document.createElement(`div`)
      ISelect.append(ISelect__Options__Wrapper)
      ISelect__Options__Wrapper.className = `i-select-options-wrapper`
      
      let ISelect__Options = document.createElement(`ul`)
      ISelect__Options__Wrapper.append(ISelect__Options)
      ISelect__Options.className = `i-select-options`
      
      for (let index = 0; index < select__options.length; index++) {
        const option = select__options[index];        
        console.log(ISelect__Options)
        let ISelect__Option = document.createElement(`li`)
        ISelect__Options.append(ISelect__Option)
        ISelect__Option.className = `i-select-option`
  
        let ISelect__Option__Button = document.createElement(`button`)
        ISelect__Option.append(ISelect__Option__Button)
        ISelect__Option__Button.className = `i-select-option-button`
        ISelect__Option__Button.innerText = option

        ISelect__Options.replaceWith(ISelect__Options)
      }
      
    });
  }
}

///////////////////////
/// CUSTOM ELEMENTS ///
///////////////////////

customElements.define("i-select", ISelect)
