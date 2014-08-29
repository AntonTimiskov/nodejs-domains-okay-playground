var _ = require('underscore');

function allDone(res){

  throw new Error('Error in heavy executor');
  
  console.log('all done');
  res.send("Okay!");
}

function setTimeoutSequense(num, next){

  console.log('defer [',num,']');
  
  if ( num === 0 ) { return next(); }

  setTimeout(_.bind(setTimeoutSequense, null, num-1, next), 0);
}

module.exports = function(req, res, next){
  
  console.log('New request');
  setTimeoutSequense(5, _.bind(allDone, null, res));
  
}

if ( require.main === module ) {
  module.exports({}, { send: function(){} });
}
