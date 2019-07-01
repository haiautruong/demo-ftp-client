'use strict';
var net = require("net");
const FTP = require("jsftp");

// const USER = "haiau123";
// const PASSWORD = "123";
// const HOST = 'localhost';

const USER = "duckha";
const PASSWORD = "123456";
const HOST = '192.168.31.107';
const POST = 21;

const Option = {
  user: USER,
  pass: PASSWORD,
  host: HOST,
  port: POST,
  createSocket: ({ port, host }, firstAction) => {
    return net.createConnection({ port, host }, firstAction);
  }
}

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

function downloadFile() {
  let ftp = new FTP(Option);

  ftp.ls("test/" + 'hai' + "*.txt", (err, res) => {
    res.sort(compare);
    console.log("----------------------------");
    // res.forEach(file => console.log(file.time));
    let lastestFile = res.map(e => {
      if (e.time > currTime) {
        return e;
      }
    });
    console.log(lastestFile);
    lastestFile.forEach(e => {
      console.log("name: ", e.name);

      let str = "";
      ftp.get("test/" + e.name, (err, socket) => {
        if (err) {
          console.log(err);
          return;
        }
        socket.on("data", d => {
          str += d.toString();
          console.log("content-----------", str);
        });
        socket.on("close", hadErr => {

          if (hadErr) {
            console.error("There was an error retrieving the file.");
          }
        });

        socket.resume();
        ftp.raw("quit", (err, data) => {
          currTime = e.time;
          if (err) {
            return console.error(err);
          }

          console.log("Bye!");
        });

      });
    })

  });
}

setInterval(downloadFile, 5000);
