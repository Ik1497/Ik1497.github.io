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

function navClick() {
    setTimeout(function () {
        location.reload();
    }, 100)
}
/// Fetch Protocol ///

document.body.insertAdjacentHTML(`afterbegin`, `<nav class="obs-events-nav"></nav>`)
// const params = window.location.hash;

getJSON('https://raw.githubusercontent.com/obsproject/obs-websocket/master/docs/generated/protocol.json',
function(err, data, hash) {
    console.log(data);
    for (var eventsLength = 0; eventsLength < data.events.length; eventsLength++) {
        let events = data.events[eventsLength];
        // NavBar
        document.querySelector(`.obs-events-nav`).insertAdjacentHTML(`beforeend`, `<li class="obs-event-list-item category-` + events.category + `"><a href="#` + events.eventType + `" onclick="navClick()">` + events.eventType + `</a></li>`);

        let hash = window.location.hash.replace("#","");
        if(hash === events.eventType) {
            document.querySelector(".obs-events-nav").insertAdjacentHTML(`afterend`, `<main class="obs-events-data"></main>`);
            document.querySelector(".obs-events-data").insertAdjacentHTML(`afterbegin`, `<section class="obs-events-data-top-section"><h1 class="obs-events-data-top-section-title">` + events.eventType + `</h1><p class="obs-events-data-top-section-group">` + events.category + `</p><p class="obs-events-data-top-section-description">` + events.description.replace("\n","<br>") + `</p></section>`);
            document.querySelector(".obs-events-data-top-section").insertAdjacentHTML(`afterend`, `<section class="obs-events-data-fields-table"><h2>Data Fields</h2><table><thead class="obs-events-data-fields-table-thead"><tr><td class="table-right">Name</td><td class="table-center">Description</td></tr></thead><tbody class="obs-events-data-fields-table-tbody"><tr><td class="table-right">Complexity Rating:</td><td class="table-center stars stars--` + events.complexity + `" style="--rating: ` + events.complexity + `;"></td></tr><tr><td class="table-right">Latest Supported RPC Version:</td><td class="table-center"><em class="obs-version-badge">` + events.rpcVersion + `</em></td></tr><tr><td class="table-right">Added in:</td><td class="table-center"><em class="obs-version-badge">` + events.initialVersion + `</em></td></tr></tbody></table></section>`);
            if (events.dataFields.length != 0) { 
                document.querySelector(".obs-events-data-fields-table").insertAdjacentHTML(`afterend`, `<section class="obs-events-variables-table"><h2>Variables</h2><table><thead class="obs-events-variables-table-thead"><tr><td class="table-right">Name</td><td class="table-center">Type</td><td class="table-left">Description</td></tr></thead><tbody class="obs-events-variables-table-tbody"></tbody></table></section>`); 
            }

            for (var variableFieldsLength = 0; variableFieldsLength < events.dataFields.length; variableFieldsLength++) {
                let variableFields = events.dataFields[variableFieldsLength];
                document.querySelector(".obs-events-variables-table-tbody").insertAdjacentHTML(`beforeend`, `<tr><td class="table-right"><code class="code datatype">` + variableFields.valueName + `</code></td><td class="table-center"><code class="datatype">` + variableFields.valueType.replace("<Array>", `<em class="datatype-data">Array</em>`).replace("<Object>", `<em class="datatype-data">Object</em>`) + `</code></td><td class="table-left">` + variableFields.valueDescription + `</td></tr>`);
            }
        }
    };
});