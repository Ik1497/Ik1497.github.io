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

//The url we want is `www.nodejitsu.com:1337/`
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
//This is the data we are posting, it needs to be a string or a buffer
req.write(JSON.stringify(
  {
    action: {
      name: actionName
    },
  }
));
req.end();
