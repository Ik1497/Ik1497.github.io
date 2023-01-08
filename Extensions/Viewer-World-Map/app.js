let icons = [
    {
        iconType: `twitch`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M11.64 5.93H13.07V10.21H11.64M15.57 5.93H17V10.21H15.57M7 2L3.43 5.57V18.43H7.71V22L11.29 18.43H14.14L20.57 12V2M19.14 11.29L16.29 14.14H13.43L10.93 16.64V14.14H7.71V3.43H19.14Z"></path></svg></span></span>`
    },
    {
        iconType: `youtube`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"></path></svg></span></span>`
    },
    {
        iconType: `twitter`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path></svg></span></span>`
    },
    {
        iconType: `github`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg></span></span>`
    },
    {
        iconType: `patreon`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M14.82 2.41C18.78 2.41 22 5.65 22 9.62C22 13.58 18.78 16.8 14.82 16.8C10.85 16.8 7.61 13.58 7.61 9.62C7.61 5.65 10.85 2.41 14.82 2.41M2 21.6H5.5V2.41H2V21.6Z"></path></svg></span></span>`
    },
    {
        iconType: `website`,
        iconPath: `<span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--dark grey--text text--lighten-2" style="font-size:16px;height:16px;width:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="font-size:16px;height:16px;width:16px;"><path d="M21 2H3c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 5H3V4h18v3Z"></path></svg></span></span>`
    }
]

let makers = [
    {
        name: `Ik1497`,
        image: `https://ik1497.github.io/assets/images/favicon.png`,
        subtitle: `Wiki Editor, Extensions Developer`,
        links: [
            {
                icon: `youtube`,
                href: `https://www.youtube.com/@Ik1497Tutorials`
            },
            {
                icon: `github`,
                href: `https://github.com/Ik1497`
            },
            {
                icon: `website`,
                href: `https://ik1497.github.io`
            }
        ]
    },
    {
        name: `GoWMan`,
        image: `https://cdn.discordapp.com/avatars/235907322151436291/131572efc33e76ab27b912cfebdbdaf1.webp`,
        subtitle: `Extensions Developer`,
        links: [
            {
                icon: `twitch`,
                href: `https://www.twitch.tv/GoWMan`
            },
            {
                icon: `youtube`,
                href: `https://www.youtube.com/@GoWMan`
            },
            {
                icon: `github`,
                href: `https://github.com/GoWMan813`
            }
        ]
    },
    {
        name: `LeBluxTV`,
        image: `https://cdn.discordapp.com/avatars/521485686151446548/eb17c8573862879872fd705c10026e75.webp`,
        subtitle: `Extensions Developer`,
        links: [
            {
                icon: `twitch`,
                href: `https://www.twitch.tv/lebluxtv`
            },
            {
                icon: `youtube`,
                href: `https://www.youtube.com/@lebluxtv`
            },
            {
                icon: `twitter`,
                href: `https://twitter.com/le_blux`
            },
            {
                icon: `github`,
                href: `https://github.com/SanshooSenshi`
            }
        ]
    },
    {
        name: `TerrierDarts`,
        image: `https://cdn.discordapp.com/avatars/236886540326928386/94e5c58f613521c5b8a268873f6aa203.webp`,
        subtitle: `Extensions Developer`,
        links: [
            {
                icon: `TerrierDarts`,
                href: `https://www.twitch.tv/TerrierDarts`
            },
            {
                icon: `youtube`,
                href: `https://www.youtube.com/@TerrierDarts`
            },
            {
                icon: `github`,
                href: `https://github.com/TerrierDarts`
            }
        ]
    }
]

makers.forEach(maker => {
    let links = ``;
    maker.links.forEach(link => {
        icons.forEach(icon => {
            if (icon.iconType === link.icon) {
                links += `<a href="${link.href}" target="_blank" rel="noopener" title="Twitch" class="mx-1 v-btn v-btn--fab v-btn--outlined v-btn--round theme--dark elevation-1 v-size--small grey--text">${icon.iconPath}</a>`
            }
        });
    });
    let card = `<span class="card--gradient-border" data-v-a1aa6ef0="" data-v-607cc2de=""><div class="gradient-border" data-v-a1aa6ef0=""></div> <div target="_blank" rel="noopener" class="d-flex flex-column v-card v-sheet theme--dark" data-v-a1aa6ef0=""><!----> <div class="v-card__text flex-grow-1 mt-auto" data-v-a1aa6ef0=""><div class="v-card__title d-flex flex-column align-center pt-0 pb-1 mb-3"><div outlined="" class="v-avatar v-list-item__avatar grey darken-3" style="height:50px;min-width:50px;width:50px;"><div aria-label="Avatar" role="img" class="v-image v-responsive theme--dark"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><div class="v-image__image v-image__image--cover" style="background-image: url(&quot;${maker.image}&quot;); background-position: center center;"></div><div class="v-responsive__content" style="width: 341px;"></div></div></div> <span class="white--text">${maker.name}</span></div> <div class="v-card__subtitle text-center">${maker.subtitle}</div> <div class="v-card__subtitle text-center py-0">${links}</div></div></div></span>`
    document.querySelector(`.v-main .feature-block:last-child .v-scroll--transition.integration-grid.mt-5`).insertAdjacentHTML(`beforeend`, card)
});
