window.addEventListener('signedIn', function() {
  var socket = io.connect();
  socket.on('discon', function(data) {
    console.log(data);
    socket.disconnect();
  });
  socket.on('connect', function() {
    var term = new Terminal({
      cols: 250,
      rows: 100,
      convertEol: true,
      useStyle: true,
      cursorBlink: true,
      screenKeys: true
    });

    term.on('data', function(data) {
      socket.emit('data', data);
    });

    term.on('title', function(title) {
      document.title = title;
    });

    term.open(document.body);

    socket.on('data', function(data) {
      term.write(data);
    });

    socket.on('disconnect', function() {
      term.destroy();
    });
  });
}, false);