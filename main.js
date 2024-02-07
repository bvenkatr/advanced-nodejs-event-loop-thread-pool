/*

Event Loop check these 3 conditions before exiting  the event loop
1. pendingTimers ---- Any Pending setTimeout, setInterval, setImmediate?
2. pendingOSTasks ---- Any Pending OS Tasks? (Like server listening to port)
3. pendingOperaitons --- Any Pending long running operations? (Like fs module)

*/


process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log("Network call: ", Date.now() - start, " this was delegated to os(async feature) by libuv");
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('crypto pbkdf2 Hash:', Date.now() - start);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log('File System:', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();
