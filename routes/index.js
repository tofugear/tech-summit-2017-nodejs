var express = require('express');
var router = express.Router();
var sha256 = require('sha256');

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

router.get('/test1', function(req, res, next) {
  var prob = inverseBinomialCoefficient(10000,5000); //0.00000007151
  // var prob = binomialCoefficient(3,2);
  
  // res.status(200).send((1.0/prob).toFixed(2).toString());
  res.status(200).send(prob.toString());
  res.end();
});

router.get('/test2', function(req, res, next) {
  n = 5000
  
  var output = recursiveSha('Hello World', n)
  console.log('Result ' + n + ' ' + output)
  res.status(200).send(output);
  res.end();
});

module.exports = router;
