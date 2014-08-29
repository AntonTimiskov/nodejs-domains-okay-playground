var _ = require('underscore');
var process = require('process');
var ok = require('okay');
var domain = require('domain');

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
  
  function onError(err){ console.error('Got error: ', err); res.send(500, err.toString()); }
  
  var reqd = domain.create();
  
  // Because req and res were created before this domain existed,
  // we need to explicitly add them.
  // See the explanation of implicit vs explicit binding below.
  reqd.add(req);
  reqd.add(res);
  
  reqd.on('error', onError);
  
  reqd.run(function(){
    
      canReportAnError(123456, ok(function(data){
        
        canReportAnError(data, ok(function(data){
        
          allDone(res);
          
        }));
        
      }));
    
  });
  
}

if ( require.main === module ) {
  module.exports({}, { send: function(d){ console.log('response sent', _.toArray(arguments)); } });
}
