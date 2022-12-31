/************/
/* Settings */
/************/ 

let httpHost = "127.0.0.1";
let httpPort = "7474";
 
/********/
/* Code */
/********/

let actionName = process.argv;

actionName.shift();
actionName.shift();

actionName = actionName.toString().replaceAll(`,`, ` `);
console.log(`Attempting to run ${actionName}...`)

const http = require('http');

const options = {
  host: httpHost,
  port: httpPort,
  path: '/DoAction',
  method: 'POST'
};

callback = function(response) {
  let str = `Succesfully ran ${actionName}`
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

const req = http.request(options, callback);
req.write(JSON.stringify(
  {
    action: {
      name: actionName
    },
    args: {
      actionHandlerFile: process.argv[1],
    }
  }
));
req.end();
