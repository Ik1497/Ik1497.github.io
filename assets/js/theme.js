settings__reloadThemes()

function settings__reloadThemes() {
    let theme = localStorage.getItem(`websiteSettings__theme`) || `dark`
    
    document.body.setAttribute(`data-theme`, theme)
}