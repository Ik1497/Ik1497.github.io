tables.forEach(index => {
    document.querySelectorAll(`table[data-var-table=${index.id}]`).forEach(table => {
        table.setAttribute(`data-settings-menu`, `closed`);
        table.insertAdjacentHTML(`beforeend`, `<thead><tr><td style="text-align: right;">Name</td><td style="text-align: left;">Description</td><td style="text-align: left;"><button><i class="mdi mdi-cog"></button></i></td></tr></thead><tbody></tbody><div class="table-settings"><button class="table-settings__discord">Copy for Discord</button></div>`);
        index.contents.forEach(tableContents => {
            table.querySelector(`tbody`).insertAdjacentHTML(`beforeend`, `<tr><td style="text-align: right;"><code>${tableContents[0]}</code></td><td style="text-align: left;">${tableContents[1]}</td></tr>`);
        });
        table.querySelector(`thead button`).addEventListener(`click`, function () {
            if (table.getAttribute(`data-settings-menu`) === `closed`) {
                table.setAttribute(`data-settings-menu`, `opened`);
            } else if (table.getAttribute(`data-settings-menu`) === `opened`) {
                table.setAttribute(`data-settings-menu`, `closed`);
            }
        });

        table.querySelector(`.table-settings__discord`).addEventListener(`click`, function () {
            let discordTable = JSON.stringify(index.contents);
            discordTable = discordTable.replaceAll(`[[`, "```yaml\n").replaceAll(`]]`, "\n```").replaceAll(`[`, ``).replaceAll(`","`, ": ").replaceAll(`],`, `\n`).replaceAll(`"`, ``).replaceAll(`<code>`, `"`).replaceAll(`</code>`, `"`);
            navigator.clipboard.writeText(discordTable);
        });

    });
});


// TOC

document.querySelector(`main`).insertAdjacentHTML(`beforebegin`, `<ul class="toc"></ul>`);

document.querySelectorAll(`h2, h3, h4, h5, h6`).forEach(heading => {
    console.log(heading);
    document.querySelector(`ul.toc`).insertAdjacentHTML(`beforeend`, `<li class="${heading.tagName.toLowerCase()}"><button>${heading.innerHTML}</button></li>`);
});