// var fetch = require('fetch');

// console.log('TESTING')

// fetch('http://localhost:3000/mobile-api/test2', 
//   { method: 'PUT',
//     headers: {'Content-Type': 'application/json'},
//     // credentials: 'same-origin'
//   }
// ).then((res)=>{
//   console.log(res)
//   if (res.status == 200){
//     res.json().then((json)=>{
//       console.log(json)
//     })
//   }
// })

var http = require('http');
var https = require('https');

http_call = (id, hostname, port, path) =>{
  console.log('HTTP Call ID:', id)
  http.get({
    hostname: hostname,
    port: port,
    path: path,
    agent: false  // create a new agent just for this one request
  }, (res) => {
    var str = '';
    res.on('data', function (chunk) {
      str += chunk;
    });
    res.on('end', function () {
      var tStamp = (new Date).getTime();
      var tSpent = tStamp-startTStamp;
      totalTime = totalTime + tSpent;
      console.log('ID:', id, 'Time Spent:', tStamp-startTStamp, 'Total Time:', totalTime , 'Response:', str);
    });
    // console.log('Response',res)
    // Do stuff with response
  }, (err)=>{
    console.log('Error:', id, err)
  });
}

https_call = (id, hostname, port, path) =>{
  console.log('HTTPS Call ID:', id)
  startTStamp[id] = (new Date).getTime()
  https.get({
    hostname: hostname,
    port: port,
    path: path,
    agent: false  // create a new agent just for this one request
  }, (res) => {
    var str = '';
    res.on('data', function (chunk) {
      str += chunk;
    });
    res.on('end', function () {
      var tStamp = (new Date).getTime();
      var tSpent = tStamp - startTStamp[id];
      totalTime = totalTime + tSpent;
      if (str == 'a90b3113da084e66d80fa8ddd86f61655dd0b02a484af18e173981c02a94b77f'){
        successCnt++
      }
      console.log('ID:', id, 'Time Spent:', tSpent, 'Total Time:', totalTime , 'Success:', successCnt, 'Response:', str);
    });
    // console.log('Response',res)
    // Do stuff with response
  }, (err)=>{
    console.log('Error:', id, err)
  });
}


var totalTime = 0;
var successCnt = 0;
var startTStamp = {}; //(new Date).getTime();

for (var i=0; i < 500; i++){
  http_call(i+1, 'techsummit-nodejs.eastus2.cloudapp.azure.com', 3000, '/test2');
  // https_call(i+1, 'tech-summit.azurewebsites.net', 443, '/api/Test02?code=vyluemgl2eobhxz81mc59udi4i16s4xo1sr0fr0wi70i93haorqfgsoqwqn0dsi1j4c65vobt9');

  // http_call(i+1, 'localhost', 3000, '/');
  
  // https_call(i+1, 'app-uat.digusign.com', 443, '/mobile-api/test2');
}



//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
// var options = {
//   // host: 'localhost',
//   // port: 3000,
//   // path: '/mobile-api/test2'
//   host: 'tech-summit.azurewebsites.net',
//   port: 443,
//   path: '/api/Test02?code=2dJ2zdCkutBXTaXkeOBdgRiysOXULh/QKQgxyPENasUmrknuYGzYKg=='
// };

// callback = function(response) {
//   var str = '';

//   //another chunk of data has been recieved, so append it to `str`
  // response.on('data', function (chunk) {
  //   str += chunk;
  // });

//   //the whole response has been recieved, so we just print it out here
//   response.on('end', function () {
//     console.log(str);
//   });
// }

// for (var i=0; i < 100; i++){
//   https.request(options, callback).end();
// }
