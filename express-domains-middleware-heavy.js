var express = require('express');
var ok = require('okay');

var app = express();

app.use(require('express-domain-middleware'));

app.get('/error-after-send', function(req, res, next){
  
  process.nextTick(ok(function(){
  
    res.send('ok');
    
    setTimeout(function(){
      throw new Error('Error occured');
    }, 0);
  }));
  
});

app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s', process.domain.id, req.method, req.url);
  console.log(err.stack);
  
  try {
  
    if ( res.finished ) { // unstable: not a public API.
      console.log('response already sent, skipping sending error as a response');
    }
  
    res.send(500, err.toString());
  } catch (e) {
    // we skip an error here because res could be already sent by the main handler
    // otherwise it will sent current error to a client
  }
});

var port = 3000;
app.listen(port);

console.log('listen on ', port);
console.log('http://localhost:'+port+'/error-after-send <- to throw an error after send (domain middleware)');

