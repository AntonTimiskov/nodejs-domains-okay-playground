var express = require('express');
var ok = require('okay');
var app = express();

var processErrorOkayDomains = require('./process-error-okay-domains.js');

app.get('/simple-error', function(req, res, next){
  
  process.nextTick(ok(next, function(){
  
    //throw new Error('Error occured');
    
    res.send('no error occured');
  }));
  
});


app.get('/domains-error', processErrorOkayDomains);

var port = 3000;
app.listen(port);

console.log('listen on ', port);
console.log('http://localhost:'+port+'/simple-error <- to throw an error (okay with next)');
console.log('http://localhost:'+port+'/domains-error <- to throw an error (okay with domains)');
