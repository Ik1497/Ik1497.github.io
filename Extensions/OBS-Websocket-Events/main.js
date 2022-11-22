/// General ///

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

addEventListener('hashchange', (event) => {
    setTimeout(function () {
        document.querySelector("main").parentNode.removeChild(document.querySelector("main"));
        let obsEventsLatestNavBarItem = sessionStorage.getItem("obs-events-latest-nav-bar-item");
        document.querySelector(`.item-` + obsEventsLatestNavBarItem).classList.remove("obs-events-nav-active");
        let hashChange = true;
        reloadData(hashChange);
    }, 10);
});
/// Fetch Protocol ///
const categoryOrder = JSON.stringify ([
    {categoryName: "general", categoryDisplayName: "General Events"},
    {categoryName: "config", categoryDisplayName: "Config Events"},
    {categoryName: "scenes", categoryDisplayName: "Scene Events"},
    {categoryName: "inputs", categoryDisplayName: "Input Events"},
    {categoryName: "transitions", categoryDisplayName: "Transition Events"},
    {categoryName: "filters", categoryDisplayName: "Filter Events"},
    {categoryName: "scene items", categoryDisplayName: "Scene Item Events"},
    {categoryName: "outputs", categoryDisplayName: "Output Events"},
    {categoryName: "media inputs", categoryDisplayName: "Media Events"},
    {categoryName: "ui", categoryDisplayName: "Ui Events"}
]);

document.body.insertAdjacentHTML(`afterbegin`, `<main></main>`);
document.body.insertAdjacentHTML(`afterbegin`, `<nav class="obs-events-nav"></nav>`);
document.body.insertAdjacentHTML(`afterbegin`, `<header><a href="/"><img src="/assets/images/favicon.png"><p class="page-title">OBS Websocket Events</p><p class="page-subtitle">By ik1497</p></a></header>`);
let categoryOrderJson =  JSON.parse(categoryOrder);

categoryOrderJson.forEach(function (item) {
    document.querySelector(".obs-events-nav").insertAdjacentHTML(`beforeend`, `<ul class="obs-events-nav-group-` + item.categoryName.replace(" ", "-") + `"><p class="obs-events-nav-group-label">` + item.categoryDisplayName + `</p></ul>`)
})

reloadData();
function reloadData(hashChange) {
    getJSON('https://raw.githubusercontent.com/obsproject/obs-websocket/master/docs/generated/protocol.json',
    function(err, data) {
        for (var eventsLength = 0; eventsLength < data.events.length; eventsLength++) {
            let events = data.events[eventsLength];
            // NavBar
            let hash = window.location.hash.replace("#","");

            if (hashChange != true) { document.querySelector(`.obs-events-nav-group-` + events.category.replace(" ", "-")).insertAdjacentHTML(`beforeend`, `<li class="obs-event-list-item category-` + events.category + ` item-` + events.eventType + `"><a href="#` + events.eventType + `"><p class="obs-event-list-item-title">` + events.eventType + `</p><p class="obs-event-list-item-description">` + events.description + `</p><em class="obs-event-list-item-version"></em></a></li>`); }
            // if (events.initialVersion != "5.0.0") { document.querySelector(`item-` + events.eventType + ` .obs-event-list-item-version`).innerHTML = events.initialVersion; };
            if(hash === events.eventType) {
                document.querySelector(`.item-` + events.eventType).classList.add("obs-events-nav-active");
                sessionStorage.setItem("obs-events-latest-nav-bar-item", events.eventType);

                document.querySelector(".obs-events-nav").insertAdjacentHTML(`afterend`, `<main class="obs-events-data"></main>`);
                document.querySelector(".obs-events-data").insertAdjacentHTML(`afterbegin`, `<section class="obs-events-data-top-section"><h1 class="obs-events-data-top-section-title">` + events.eventType + `</h1><p class="obs-events-data-top-section-description">` + events.description.replace("\n","<br>") + `</p></section>`);
                document.querySelector(".obs-events-data-top-section").insertAdjacentHTML(`afterend`, `<section class="obs-events-data-fields-table"><h2>Data Fields</h2><table><thead class="obs-events-data-fields-table-thead"><tr><td class="table-right">Name</td><td class="table-center">Description</td></tr></thead><tbody class="obs-events-data-fields-table-tbody"><tr><td class="table-right">Complexity Rating:</td><td class="table-center stars stars--` + events.complexity + `" style="--rating: ` + events.complexity + `;"></td></tr><tr><td class="table-right">Latest Supported RPC Version:</td><td class="table-center"><em class="obs-version-badge">` + events.rpcVersion + `</em></td></tr><tr><td class="table-right">Added in:</td><td class="table-center"><em class="obs-version-badge">v` + events.initialVersion + `</em></td></tr></tbody></table></section>`);
                if (events.dataFields.length != 0) { 
                    document.querySelector(".obs-events-data-fields-table").insertAdjacentHTML(`afterend`, `<section class="obs-events-variables-table"><h2>Variables</h2><table><thead class="obs-events-variables-table-thead"><tr><td class="table-right">Name</td><td class="table-center">Type</td><td class="table-left">Description</td></tr></thead><tbody class="obs-events-variables-table-tbody"></tbody></table></section>`); 
                }

                for (var variableFieldsLength = 0; variableFieldsLength < events.dataFields.length; variableFieldsLength++) {
                    let variableFields = events.dataFields[variableFieldsLength];
                    document.querySelector(".obs-events-variables-table-tbody").insertAdjacentHTML(`beforeend`, `<tr><td class="table-right"><code class="code datatype">obsEvent.` + variableFields.valueName + `</code></td><td class="table-center"><code class="datatype">` + variableFields.valueType.replace("<Array>", `<em class="datatype-data">Array</em>`).replace("<Object>", `<em class="datatype-data">Object</em>`) + `</code></td><td class="table-left">` + variableFields.valueDescription + `</td></tr>`);
                }
            }
        };
    });
};
