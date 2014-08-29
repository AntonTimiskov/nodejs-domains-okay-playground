var express = require('express');
var ok = require('okay');
var domain = require('domain');
var _ = require('underscore');

var app = express();

function customDomains(customErrorHandler, mainFunction){
  
  return function(req, res, next){
  
    var reqd = domain.create();
    
    reqd.add(req);
    reqd.add(res);
    
    reqd.on('error', function(err){
      customErrorHandler(req, res, next, err);
    });
      
    reqd.run(_.bind(mainFunction, null, req, res, next));
  
  };
  
}

app.get('/error-after-send-1', customDomains(
  function errorHandler(req, res, next, err){
    console.log('in error handler', err);

    if (res && !res.finished) {
      res.send(500, err);
    }
  },
  function(req, res, next, background){
  
    //throw new Error('Error 1 occured in main handler');

    console.log('sending response to client')
    res.send('ok 1');
    
    setTimeout(function(finish){
      console.log('throwing an error');
      throw new Error('Error 1 occured in background');
    },100);
    
  })
);


var port = 3000;
app.listen(port);

console.log('listen on ', port);
console.log('http://localhost:'+port+'/error-after-send-1 <- to throw an error after send (domain middleware)');


