var express = require('express');

var app = express();

app.get('/err', function(){
  throw new Error('Arrrrr!');
});

app.get('/err2', function(){
  
  setTimeout(function(){
    throw new Error('Arrrrr!');
  });
  
});

var port = 3000;
app.listen(port);

console.log('listen on ', port);
console.log('http://localhost:'+port+'/err <- express handle this error normally');
console.log('http://localhost:'+port+'/err2 <- express CANT handle error in setTimout');


