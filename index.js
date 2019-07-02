'use strict';
var net = require("net");
const FTP = require("jsftp");

// const USER = "haiau123";
// const PASSWORD = "123";
// const HOST = 'localhost';

const USER = 'haiau123';
const PASSWORD = "haiau@@123";
const HOST = 'ftp.drivehq.com';
const POST = 21;

let currTime = 0;
function compare(a, b) {
  if (a.time > b.time) {
    return 1;
  }
  if (a.time < b.time) {
    return -1;
  }
  return 0;
}

function connect() {
  const Option = {
    user: USER,
    pass: PASSWORD,
    host: HOST,
    port: POST,
    createSocket: ({ port, host }, firstAction) => {
      return net.createConnection({ port, host }, firstAction);
    }
  }
  return new FTP(Option);
}

function disconnect(ftp) {
  ftp.raw('quit', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      // console.log('disconnected');
    }
  })
}

function getList() {
  return new Promise((resolve, reject) => {
    let ftp = connect();
    console.log('ftp-----------------', ftp);
    ftp.ls('GroupRead/*' + 'au' + "*.txt", (err, res) => {
      console.log('res--------------------', res);
      console.log('err--------------------', err);
      if (err) {
        reject(err);
      }
      else {
        res.sort(compare);
        resolve(res);
        // disconnect(ftp);
      }
    })
  })
}

function downFile(filename) {
  return new Promise((resolve, reject) => {
    let ftp = connect();
    console.log('connected!!!!!!!!!!!');
    ftp.get("GroupRead/" + filename, (err, socket) => {
      if (err) {
        console.log('err', err);
        reject(err);
      }
      else {
        socket.on("data", d => {

          d = d.toString();
          resolve(d);
        });
        socket.on("close", hadErr => {

          if (hadErr) {
            reject(hadErr)
          }
        });
        socket.resume();
        // disconnect(ftp);
      }
    })
  })
}

function downloadFile() {
  getList().then(listFile => {
    console.log('listFile-------------------', listFile);
    listFile.map(file => {
      downFile(file.name).then(data => {
        console.log('data', data);
        console.log('typeof data', typeof data);
        console.log('updated data', data.split('\n'));
      });
    })
  }).catch(err => {
    console.log(err);
  })
}

downloadFile();