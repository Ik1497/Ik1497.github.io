document.write(`
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js" integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg=" crossorigin="anonymous" ></script>
`);

document.querySelectorAll(`a`).forEach(a => {
    a.classList.add( location.hostname === a.hostname || !a.hostname.length ? 'is-internal-link' : 'is-external-link' );
});

if (tableData != undefined) {
    tableData.forEach(table => {
        let uniqueTableHeads = []
        let selectedTable = document.querySelector(`[data-table="${table.id}"]`)
        selectedTable.innerHTML = `<thead><tr></tr></thead><tbody></tbody>`

        table.contents.forEach(tableContent => {
            Object.keys(tableContent).forEach(tableKey => {
                if (!uniqueTableHeads.includes(tableKey)) {
                    uniqueTableHeads.push(tableKey)
                    selectedTable.querySelector(`thead tr`).innerHTML += `<th>${tableKey}</th>`
                }
            });

            let td = `` 
            Object.values(tableContent).forEach(tableBodyValues => {
                td += `<td style="text-align: center;">${tableBodyValues}</td>`
            });
            selectedTable.querySelector(`tbody`).innerHTML += `<tr>${td}</tr>`

        });
        selectedTable.querySelectorAll(`tbody tr td:first-child, thead tr th:first-child`).forEach(element => {
            element.style.textAlign = `right`
        });
        selectedTable.querySelectorAll(`tbody tr td:last-child, thead tr th:last-child`).forEach(element => {
            element.style.textAlign = `left`
        });
        selectedTable.querySelectorAll(`tbody tr td:not(:last-child)`).forEach(element => {
            element.innerHTML = `<code>${element.innerHTML}</code>`
        });
    });
}
