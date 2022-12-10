fetchPackage();

async function fetchPackage() {
    let response = await fetch('/package.json');
    let data = await response.json();

    console.log(data);

    
    document.querySelector("main").insertAdjacentHTML(`afterbegin`,
    `<h1>${data.name}</h1>
    <p>${data.license} license, Version ${data.version}, By ${data.author}</p>
    <h2 data-type="devDependencies">Dev Dependencies</h2>
    <ul data-type="devDependencies"></ul>
    <h2 data-type="dependencies">Dependencies</h2>
    <ul data-type="dependencies"></ul>
    <h2 data-type="scripts">Scripts</h2>
    <ul data-type="scripts"></ul>`
    );

    let devDependenciesEntries = Object.entries(data.devDependencies);
    devDependenciesEntries.forEach(index => {
        document.querySelector(`ul[data-type="devDependencies"]`).insertAdjacentHTML(`beforeend`, `<li>${index[0]}: ${index[1]}</li>`);
    });
    let dependenciesEntries = Object.entries(data.dependencies);
    dependenciesEntries.forEach(index => {
        document.querySelector(`ul[data-type="dependencies"]`).insertAdjacentHTML(`beforeend`, `<li>${index[0]}: ${index[1]}</li>`);
    });
    let scriptsEntries = Object.entries(data.scripts);
    scriptsEntries.forEach(index => {
        document.querySelector(`ul[data-type="scripts"]`).insertAdjacentHTML(`beforeend`, `<li>${index[0]}: ${index[1]}</li>`);
    });
}
