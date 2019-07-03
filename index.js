'use strict';
var net = require("net");
const FTP = require("jsftp");

const USER = "haiau123";
const PASSWORD = "123";
const HOST = 'localhost';

// const USER = 'dung123';
// const PASSWORD = "dung@@123";
// const HOST = 'ftp.drivehq.com';

// const USER = 'haiau762';
// const PASSWORD = "haiau@@123";
// // const HOST = 'files.000webhost.com';
// const HOST = 'ftp.drivehq.com';
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
    // console.log('ftp-----------------', ftp);
    ftp.ls('test/*' + 'au' + "*.txt", (err, res) => {
      // console.log('res--------------------', res);
      console.log('err--------------------', err);
      if (err) {
        reject(err);
      }
      else {
        res.sort(compare);
        resolve(res);
        disconnect(ftp);
      }
    })
  })
}

function downAndSaveFile(filename) {
  return new Promise((resolve, reject) => {
    let ftp = connect();
    ftp.get("test/" + filename, "result.txt", (err) => {
      if (err) {
        console.log('err', err);
        reject(err);
      }
      disconnect(ftp);
    })
  })
}

function downFile(filename) {
  return new Promise((resolve, reject) => {
    let ftp = connect();
    ftp.get("test/" + filename, (err, socket) => {
      if (err) {
        console.log('err', err);
        reject(err);
      }
      else {
        let alldata = "";

        socket.on("data", d => {
          
          alldata += d.toString();
        });

        socket.on("close", hadErr => {

          if (hadErr) {
            reject(hadErr)
          }
          else{
            resolve(alldata);
          }
        });
        socket.resume();
        disconnect(ftp);
      }
    })
  })
}

function downloadFile() {
  getList().then(listFile => {
    // console.log('listFile-------------------', listFile);
    // listFile.map(file => {
    //   downFile(file.name).then(data => {
    //     console.log('updated data', data.split('\r\n'));
    //   });
    // })

    listFile.forEach(file => {
      let arrayData = null;
      downFile(file.name).then(data => {
        arrayData = data.split('\r\n');
        console.log(arrayData);
      })
    });
    // downAndSaveFile('haiau2.txt');
  }).catch(err => {
    console.log(err);
  })
}

downloadFile();