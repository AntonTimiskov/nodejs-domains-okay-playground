var _ = require('underscore');
var process = require('process');
var ok = require('okay');

function allDone(res){

  console.log('all done');
  res.send("Okay!");
}

function canReportAnError(data, next){
  
  console.log('call canReportAnError');
  
  setTimeout(function(){
  
    //err = new Error('Something went wrong');
    //return next(err);
  
    next(null, data);
    
  }, 0);
}

module.exports = function(req, res, next){
  
  console.log('New request');
  
  function onError(err){ console.error('Got error: ', err); res.send(500, err.toString()); }
  
  process.nextTick(function(){
    
      canReportAnError(123456, ok(onError, function(data){
        
        canReportAnError(data, ok(onError, function(data){
        
          allDone(res);
          
        }));
        
      }));
    
  });
  
}

if ( require.main === module ) {
  module.exports({}, { send: function(d){ console.log('response sent', _.toArray(arguments)); } });
}
