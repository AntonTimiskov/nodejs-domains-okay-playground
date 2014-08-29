var _ = require('underscore');
var process = require('process');

function allDone(res){

  console.log('all done');
  res.send("Okay!");
}

function canReportAnError(data, next){
  
  console.log('call canReportAnError');
  
  setTimeout(function(){
  
    err = new Error('Something went wrong');
    return next(err);
  
    next(null, data);
    
  }, 0);
}

module.exports = function(req, res, next){
  
  console.log('New request');
  
  function onError(err){ res.send(500, err.toString()); }
  
  process.nextTick(function(){
    
      canReportAnError(123456, function(err, data){
        
        if ( err ) {
          console.log('Error occured in first: ', err);
          onError(err);
          throw err;
        }
        
        canReportAnError(data, function(err, data){
        
          if ( err ) {
            console.log('Error occured in second: ', err);
            onError(err);
            throw err;
          }
          
          allDone(res);
          
        });
        
      });
    
  });
  
}

if ( require.main === module ) {
  module.exports({}, { send: function(){ console.log('response sent', _.toArray(arguments)) } });
}
