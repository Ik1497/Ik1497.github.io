function reloadTabSets() {
  document.querySelectorAll(`div.tabset:not([data-loaded])`).forEach(tabset => {
    tabset.setAttribute(`data-loaded`, ``)
    let tabset__Nav = document.createElement(`nav`)
    tabset.prepend(tabset__Nav)

    let tabset__Nav__Ul = document.createElement(`ul`)
    tabset__Nav.append(tabset__Nav__Ul)
      
      tabset.querySelectorAll(`div[data-tab]`).forEach(tab => {
        let tabset__Nav__Ul__Li = document.createElement(`li`)
        tabset__Nav__Ul.append(tabset__Nav__Ul__Li)
        
        let tabset__Nav__Ul__Li__Button = document.createElement(`button`)
        tabset__Nav__Ul__Li__Button.innerHTML = tab.getAttribute(`data-tab`)
        tabset__Nav__Ul__Li.append(tabset__Nav__Ul__Li__Button)
        
        tab.setAttribute(`hidden`, ``)
        tabset.querySelector(`div[data-tab]`)?.removeAttribute(`hidden`)
        tabset__Nav__Ul.querySelector(`li`).classList.add(`active`)

        tabset__Nav__Ul__Li__Button.addEventListener(`click`, () => {
          tabset__Nav__Ul.querySelectorAll(`li.active`).forEach(listItem => {
            listItem.classList.remove(`active`)
          });

          tabset.querySelectorAll(`div[data-tab]`).forEach(tab => {
            tab.setAttribute(`hidden`, ``)
          });

          tabset__Nav__Ul__Li.classList.add(`active`)

          tab.setAttribute(`hidden`, ``)
          tab.removeAttribute(`hidden`)
        })
      });
  });  
}