var express = require('express');
var router = express.Router();
var Q = require('q');
var sha256 = require('sha256');
var https = require('https');

// var azfnLBCnt = process.env.AZFNLBCNT
var azfnSubDomain = process.env.AZFNSUBDOMAIN
var azfnDomain = process.env.AZFNDOMAIN
var azfnSha256Path = process.env.AZFNSHA256PATH

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



inverseBinomialCoefficient= (n,k) =>{
  if (n==k){
    return 1.0;
  } else {
    console.log(n,k, n/k)
    return ((n-k)/n) * inverseBinomialCoefficient(n-1,k);
  }
}

recursiveSha = (str, n) =>{
  if (n==0){
    return str;
  } else {
    return recursiveSha(sha256(str), n-1);
  }
}

strPaddingZero = (strInput, padLen) =>{
  var result = '';
  if (strInput == null){
    result = ''
  } else if (strInput.length > padLen) {
    result = strInput.substring(strInput.length - padLen, strInput.length)
  } else {
    result = strInput;
    for (var i = strInput.length; i < padLen; i++) {
      result = '0' + result;
    }
  }
  return result;
}

router.get('/test1', function(req, res, next) {
  var prob = inverseBinomialCoefficient(10000,5000); //0.00000007151
  // var prob = binomialCoefficient(3,2);
  
  // res.status(200).send((1.0/prob).toFixed(2).toString());
  res.status(200).send(prob.toString());
  res.end();
});

router.get('/Sha256Test', function(req, res, next) {

  var n1 = req.query.n1
  var n2 = req.query.n2
  var str = 'Hello World'
  var q_list = [];
  for (var i=0; i<n2; i++){
    q_list.push(recursiveSha(str, n1))
  }
  Q.all(q_list).then((result)=>{
    res.status(200).send(n1 + ' ' + n2);
    res.end();
  }, (err)=>{
    res.status(200).send(err);
    res.end();
  })
  
});

router.get('/Sha256TestLB', function(req, res, next) {
  var azfnLBCnt = parseInt(req.query.azfnLBCnt, 10);
  var randAzFn = Math.floor(Math.random() * (azfnLBCnt - 1) + 1.5);
  var n1 = req.query.n1
  var n2 = req.query.n2
  var hostname = azfnSubDomain + 'lb' + strPaddingZero(randAzFn.toString(),2) + '.' + azfnDomain
  var path = azfnSha256Path + '/?n1=' + n1.toString() + '&n2=' +  n2.toString()
  // console.log(azfnLBCnt, azfnSubDomain, azfnDomain, azfnSha256Path)
  console.log('hostname:', hostname, 'path:', path)
  // console.log('path:', azfnSha256Path + '/?n1=100&n2=100')
  https.get({
    hostname:  hostname, //azfnSubDomain + 'lb01.' + azfnDomain,
    port: 443,
    // path: azfnSha256Path + '/?n1=100&n2=100',
    path: path,
    agent: false  // create a new agent just for this one request
  }, (response) => {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      console.log(str);
      res.status(200).send(hostname + " " + str);
      res.end();
    });
  }, (err)=>{
    console.log('Sha256TestLB Error:', err)
  });
})

module.exports = router;
