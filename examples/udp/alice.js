var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var restStream = require('../../index.js');

var rest = new restStream(socket);

rest.on('data', function(message) {
  socket.send(message, 0, message.length, 1337, 'localhost', function(error) {
    if (error) {
      rest.end();
    }
  });
});

rest.on('end', function() {
  socket.close();
});

socket.on('message', function(message, rinfo) {
  rest.write(message);
});

socket.bind(1338);

rest.onRequest('exit', function(callback) {
  callback('Bye');
  
  setTimeout(function() {
    console.log('Closing...');
    rest.end();
  }, 100);
});

rest.onRequest('concat', function(arg1, arg2, arg3, callback) {
  var res = arg1 + arg2 + arg3;
  
  console.log('Concat:', res);
  callback(res);
});