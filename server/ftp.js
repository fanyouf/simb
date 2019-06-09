const Client = require('ftp');
const fs = require('fs');
const c = new Client();
const path = require('path');
const BASICPATH = path.join('../', 'dist');

c.on('ready', function() {
  console.log('ready...');
  c.put(path.join(BASICPATH, 'index.html'), '/htdocs/index.html', function(
    err
  ) {
    if (err) {
      throw err;
    }
    console.log('上传Ok');
    c.end();
  });
  //   c.get('/htdocs/getPros.php', function(err, stream) {
  //     if (err) {
  //       throw err;
  //     }
  //     stream.once('close', function() {
  //       c.end();
  //     });
  //     stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
  //   });
});
// connect to localhost:21 as anonymous
c.connect({
  host: 'byu3151120001.my3w.com',
  user: 'byu3151120001',
  password: 'fanyf123.'
});
