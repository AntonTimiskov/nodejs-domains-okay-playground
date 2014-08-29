var express = require('express');
var ok = require('okay');

var app = express();

app.use(require('express-domain-middleware'));

app.get('/simple-error', function(req, res, next){
  
  process.nextTick(ok(function(){
  
    throw new Error('Error occured');
    
    res.send('no error occured');
  }));
  
});

app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s', process.domain.id, req.method, req.url);
  console.log(err.stack);
  res.send(500, err.toString());
  if(err.domain) {
    //you should think about gracefully stopping & respawning your server
    //since an unhandled error might put your application into an unknown state
  }
});

var port = 3000;
app.listen(port);

console.log('listen on ', port);
console.log('http://localhost:'+port+'/simple-error <- to throw an error (domain middleware)');

