/*
function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...");

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...");

    };

    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          request: "GetActions",
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<nav class="navbar"><ul class="navbar-list"></ul></nav><main><ul class="actions"></ul></main>`);
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
        
    });
  }
}
*/

app();

async function app() {
    // Fetch Requests
    let requests = await fetch(`https://raw.githubusercontent.com/obsproject/obs-websocket/master/docs/generated/protocol.json`);
    requests = await requests.json();
    console.log(requests);
    requests = requests.requests;
    requests.sort();

    // Add HTML
    document.body.insertAdjacentHTML(`afterbegin`, `<nav><input type="search" placeholder="search..."><ul></ul></nav><main></main>`);

    // Navigation
    let uniqueCategories = [];

    // Categories
    requests.forEach(request => {
        if (request.category === "") {
        } else if (!uniqueCategories.includes(request.category)) {
          uniqueCategories.push(request.category);
        }
        uniqueCategories = uniqueCategories.sort();
    });

    uniqueCategories.forEach(category => {
        category = category.replaceAll(` `, `-`);
        document.querySelector(`nav ul`).insertAdjacentHTML(`beforeend`, `<ul class="${category}"><p>${category.replaceAll(`-`, ` `)}</p></ul>`);
    });

    // Requests
    requests.forEach(request => {
        request.category = request.category.replaceAll(` `, `-`);
        document.querySelector(`nav ul ul.${request.category}`).insertAdjacentHTML(`beforeend`, `<li aria-hidden="false" class><button><span class="ripple-layer"></span><p class="title">${request.requestType}</p><p class="description">${request.description}</p></button></li>`);
    });

    // Active Class
    document.querySelectorAll(`nav li button`).forEach(button => {
        button.addEventListener("click", buttonClick => {
            document.querySelectorAll(`.nav-active`).forEach(navActiveElement => {
                navActiveElement.classList.remove(`nav-active`);
            });
            
            button.parentElement.classList.add(`nav-active`);

            // Main
            window.location.href = `#${button.querySelector(`.title`).innerHTML}`

            requests.forEach(request => {
                if (button.querySelector(`.title`).innerHTML === request.requestType) {
                    document.querySelector(`main`).parentNode.removeChild(document.querySelector(`main`));
                    let htmlRequestTop      = `<h1>${request.requestType}</h1><p class="subtitle">${request.description}</p>`
                    let htmlRequestResponse = ``

                    
                    let requestFields = ``;
                    let cphRequestFields = ``;
                    let clipboardRequestFields = ``;
                    let codeHighlightingColors = {
                        key: "#ff79c6",
                        string: "#50fa7b",
                        number: "#bd93f9",
                        boolean: "#bd93f9",
                        any: "#bd93f9",
                        object: "#ffffff",
                        function: "#f1fa8c",
                        bracket: "#ffffff",
                        comma: "#ffffff",
                        colon: "#ffffff",
                        backslash: "#ffffff"
                    }
                    request.requestFields.forEach(requestField => {


                        let optional = ``;
                        if (requestField.valueOptional === true) {
                            // optional = ` (Optional)`
                        }

                        let property = `<span style="color: #ffffff"></span>`;
                        if (requestField.valueType === `String`) { property = `<span style="color: ${codeHighlightingColors.string}">"&lt;${requestField.valueName.toLowerCase()}&gt;${optional}"</span>`; }
                        if (requestField.valueType === `Number`) { property = `<span style="color: ${codeHighlightingColors.number}">0${optional}</span>`; }
                        if (requestField.valueType === `Boolean`) { property = `<span style="color: ${codeHighlightingColors.boolean}">true${optional}</span>`; }
                        if (requestField.valueType === `Any`) { property = `<span style="color: ${codeHighlightingColors.any}">Any${optional}</span>`; }
                        if (requestField.valueType === `Object`) { property = `<span style="color: ${codeHighlightingColors.object}">{}${optional}</span>`; }
                        requestFields = `${requestFields}    <span style="color: ${codeHighlightingColors.key}">"${requestField.valueName}"</span><span style="color: ${codeHighlightingColors.colon}">:</span> ${property}<span style="color: ${codeHighlightingColors.comma}">,</span><br>`
                        if (requestField.valueType === `String`) { property = `<span style="color: ${codeHighlightingColors.string}"><span style="color: ${codeHighlightingColors.backslash}">&#92;</span>"&lt;${requestField.valueName.toLowerCase()}&gt;${optional}<span style="color: ${codeHighlightingColors.backslash}">&#92;</span>"</span>`; }
                        cphRequestFields = `${cphRequestFields}&#92;<span style="color: ${codeHighlightingColors.key}">"${requestField.valueName}</span>&#92;<span style="color: ${codeHighlightingColors.key}">"</span><span style="color: ${codeHighlightingColors.colon}">:</span>${property}<span style="color: ${codeHighlightingColors.comma}">,</span>`
                        // {\"fpsNumerator\":0,\"fpsDenominator\":0,\"baseWidth\":0,\"baseHeight\":0,\"outputWidth\":0,\"outputHeight\":0}


                        if (requestField.valueType === `String`) { clipboardProperty = `"<${requestField.valueName.toLowerCase()}>${optional}"`; }
                        if (requestField.valueType === `Number`) { clipboardProperty = `0${optional}`; }
                        if (requestField.valueType === `Boolean`) { clipboardProperty = `true${optional}`; }
                        if (requestField.valueType === `Any`) { clipboardProperty = `Any${optional}`; }
                        if (requestField.valueType === `Object`) { clipboardProperty = `{}${optional}`; }

                        clipboardRequestFields = `${clipboardRequestFields}    "${requestField.valueName}": ${clipboardProperty},\n`
                    });
                    
                    if (JSON.stringify(request.requestFields) === `[]`) {
                        requestFields = undefined;
                        clipboardRequestFields = undefined;
                    } else {
                        requestFields = requestFields.slice(0, -4);
                        clipboardRequestFields = clipboardRequestFields.slice(0, -2);
                    }

                    
                    let htmlRequestCode = `<pre><code><span style="color: ${codeHighlightingColors.bracket}">{</span><br>  <span style="color: ${codeHighlightingColors.key}">"requestType"</span><span color: ${codeHighlightingColors.colon}>:</span> <span style="color: ${codeHighlightingColors.string}">"${request.requestType}"</span><span style="color: ${codeHighlightingColors.comma}">,</span><br>  <span style="color: ${codeHighlightingColors.key}">"requestData"</span><span style="color: ${codeHighlightingColors.colon}">:</span> <span style="color: ${codeHighlightingColors.bracket}">{</span><br>${requestFields}<br>  <span style="color: ${codeHighlightingColors.bracket}">}</span><br><span style="color: ${codeHighlightingColors.bracket}">}</span></code></pre>`
                    let clipboardRequestCode = `{\n  "requestType": "${request.requestType}",\n  "requestData": {\n${clipboardRequestFields}\n  }\n}`
                    clipboardRequestCode = '```json\n' + clipboardRequestCode + '\n```'
                    
                    if (requestFields === undefined) { 
                        htmlRequestCode = `<pre><code><span style="color: ${codeHighlightingColors.bracket}">{</span><br>  <span style="color: ${codeHighlightingColors.key}">"requestType"</span><span color: ${codeHighlightingColors.colon}>:</span> <span style="color: ${codeHighlightingColors.string}">"${request.requestType}"</span><br><span style="color: ${codeHighlightingColors.bracket}">}</span></code></pre>`
                    }
                    
                    if (clipboardRequestFields === undefined) { 
                        clipboardRequestCode = `{\n  "requestType": "${request.requestType}"\n}`
                        clipboardRequestCode = '```json\n' + clipboardRequestCode + '\n```'
                    }

                    let htmlCPHRequestCode = `<pre><code>CPH.<span style="color: ${codeHighlightingColors.function}">ObsSendRaw</span>(<span style="color: ${codeHighlightingColors.string}">"${request.requestType}"</span><span style="color: ${codeHighlightingColors.comma}">,</span> "{${cphRequestFields}}"<span style="color: ${codeHighlightingColors.comma}">,</span> <span style="color: ${codeHighlightingColors.number}">0</span>);</code></pre>`

                    navigator.clipboard.writeText(clipboardRequestCode);

                    document.querySelector(`nav`).insertAdjacentHTML(`afterend`, `<main>${htmlRequestTop}${htmlRequestCode}${htmlCPHRequestCode}${htmlRequestResponse}</main>`);
                }
            });
        });


        // Animation
        // button.addEventListener("mousedown", buttonClick => {
        //     let buttonProps = buttonClick.target.getBoundingClientRect();
        //     let y = buttonClick.clientY - buttonProps.top;
        //     let x = buttonClick.clientX - buttonProps.left;

        //     console.log(buttonProps)
        //     console.log(x, y);
        //     button.querySelector(`.ripple-layer`).style.cssText  = `top:${y}px;left:${x}px;`;
        // });

        // button.addEventListener("mouseup", buttonClick => {
        //     let buttonProps = buttonClick.target.getBoundingClientRect();
        //     let y = buttonClick.clientY - buttonProps.top;
        //     let x = buttonClick.clientX - buttonProps.left;

        //     console.log(buttonProps)
        //     console.log(x, y);
        //     button.querySelector(`.ripple-layer`).style.cssText  = `opacity:0.8;top:0;left:0;width:${buttonProps.width}px;height:${buttonProps.height}px;`;
        // });
    });

    // Search Engine
    document.querySelector(`nav input[type=search]`).addEventListener(`keydown`, function () {        
        setTimeout(() => {
            let searchTerm = document.querySelector(`nav input[type=search]`).value.toLowerCase();

            document.querySelectorAll(`nav li button`).forEach(button => {
                if (button.querySelector(`.title`).innerText.toLowerCase().includes(searchTerm) === true) {
                    button.parentNode.removeAttribute(`hidden`);
                    button.parentNode.setAttribute(`aria-hidden`, `false`);
                } else {
                    button.parentNode.setAttribute(`hidden`, ``);
                    button.parentNode.setAttribute(`aria-hidden`, `true`);
                }
            });
        }, 10);
    });
};
