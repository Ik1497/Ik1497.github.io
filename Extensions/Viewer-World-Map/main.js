// -------------- //
// Websocket Code //
// -------------- //
connectws();

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
          request: "Subscribe",
          events: {
            General: ["Custom"],
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };
      console.log(data);
      var widget = data.data?.widget;
      if (widget != "viewer-world-map") return;

      var name = data.data?.name;
      if (name === undefined) return;

      var lat = data.data?.lat;
      if (lat === undefined) return;

      var lon = data.data?.lon;
      if (lon === undefined) return;

      highchartsData.series[1].data.push({name: name, lat: lat, lon: lon});
      updateMap();
    });
  }
}

// -------- //
// Map Code //
// -------- //

var data = [];

var map = Highcharts.maps['custom/world'];
var features = map.features;
    
let highchartsData = {

    title : {
        text : 'Viewers Map'
    },

    subtitle: {
        text: '!TestGeo {location name} {latitude} {longitude}'
    },

    mapNavigation: {
        enabled: true          
    },

    colorAxis: {
        min: 0
    },

    series : [{
        data : data,
        mapData: Highcharts.maps['custom/world'],
        joinBy: 'hc-key',
        name: 'Random data',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: false,
            useHTML: true,
            format: '<a class="my-link" onclick="myFunction()">{point.name}</a>'
        }
    },
    {
	    type: 'mappoint',
	    name: 'my countries',
        color: 'blue',
        dataLabels: {
            useHTML: true,
            format: '{point.name}'
        },
	    data: []	
    }
]};

// Initiate the chart
updateMap();
function updateMap() {
    $('#container').highcharts('Map', highchartsData, function(chart){
        console.log(highchartsData.series[1].data);
    });
};
