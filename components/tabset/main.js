reloadTabSets()

function reloadTabSets() {
  document.querySelectorAll(`div.i-tabset:not([data-loaded])`).forEach(tabset => {
    let tabsetTabCount = tabset.querySelectorAll(`div[data-tab]`).length
    let tabsetGap = `0.25`

    tabset.innerHTML = `<div class="i-tabset-tabs">${tabset.innerHTML}</div>`

    tabset.setAttribute(`data-loaded`, ``)
    let tabset__Nav = document.createElement(`div`)
    tabset__Nav.className = `i-tabset-navigation`
    tabset.prepend(tabset__Nav)

    let tabset__Nav__Ul = document.createElement(`ul`)
    tabset__Nav__Ul.style.gap = `${tabsetGap}rem`
    tabset__Nav.append(tabset__Nav__Ul)

    let tabset__activeIndicator = document.createElement(`div`)
    tabset__activeIndicator.className = `i-tabset-active-indicator`
    tabset__activeIndicator.style.left = `0%`
    tabset__activeIndicator.style.width = `calc(${100 / tabsetTabCount}% - ${tabsetGap}rem)`
    tabset__Nav.append(tabset__activeIndicator)
    
    tabset.querySelectorAll(`div[data-tab]`).forEach((tab, tabIndex) => {
      
      let tabset__Nav__Ul__Li = document.createElement(`li`)
      tabset__Nav__Ul.append(tabset__Nav__Ul__Li)
      
      let tabset__Nav__Ul__Li__Button = document.createElement(`button`)
      tabset__Nav__Ul__Li__Button.innerHTML = tab.getAttribute(`data-tab`)
      tabset__Nav__Ul__Li.append(tabset__Nav__Ul__Li__Button)
      
      tab.setAttribute(`data-state`, `inactive`)
      tabset.querySelector(`div[data-tab]`)?.setAttribute(`data-state`, `active`)
      tabset__Nav__Ul.querySelector(`li`).classList.add(`active`)

      tabset__Nav__Ul__Li__Button.addEventListener(`click`, () => {
        tabset.querySelectorAll(`div[data-tab][data-state]`).forEach(tab => {
          tab.setAttribute(`data-state`, `becoming-inactive`)
          
          setTimeout(() => {
            tab.setAttribute(`data-state`, `inactive`)
          }, 500);
        });

        tabset__Nav__Ul.querySelectorAll(`li.active`).forEach(listItem => {
          listItem.classList.remove(`active`)
        });

        tabset__activeIndicator.style.left = `${((100 / tabsetTabCount) * (tabIndex + 1)) - (100 / tabsetTabCount)}%`

        tabset__Nav__Ul__Li.classList.add(`active`)

        tab.setAttribute(`data-state`, `becoming-active`)
          
        setTimeout(() => {
          tab.setAttribute(`data-state`, `active`)
        }, 500);
      })
    });
  });  
}
