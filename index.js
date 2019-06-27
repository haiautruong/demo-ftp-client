'use strict';
var net = require("net");
const FTP = require("jsftp");
const SocksClient = require('socks').SocksClient;


const USER = "haiau123";
const PASSWORD = "123";
const HOST = '192.168.31.107'; // host proxy
//const HOST = 'localhost';

const POST = 80

const option = {
    user: USER,
    pass: PASSWORD,
    host: HOST,
    port: POST,
    createSocket: ({ port, host }, firstAction) => {
        return net.createConnection({ port, host }, firstAction);
    }

}
let ftp = new FTP(option);
let str = "";
ftp.get("test/haiau1.txt", async (err, socket) => {
    if (err) {
        console.log(err);
      return;
    }
    console.log("-----------");
    await socket.on("data", d => {
      str += d.toString();
      console.log("content", str);
    });
   
    socket.on("close", hadErr => {
      if (hadErr) {
        console.error("There was an error retrieving the file.");
      }
    });
   
    socket.resume();
  });

// let listFile = ["haiau1.txt"];
// function downloadFiles() {
//     for (let i = 0; i < listFile.length; i++) {
//         let dir = "test/";
//         let path = dir + listFile[i];
//         let ftp = new FTP(option);
//         console.log("ftp", ftp);
//         let content = "";
//         try {
//             ftp.get(path, (err, socket) => {
//                 console.log("get")
//                 if (err) {
//                     console.log("err", err);
//                     return;
//                 }

//                 socket.on("data", d => {
//                     content += d.toString();
//                     console.log(content);
//                     // console.log(content);
//                 });

//                 socket.on("close", err => {
//                     if (err) {
//                         console.error("There was an error retrieving the file.");
//                     }
//                 });

//                 socket.resume();
//                 // ftp.raw("quit", (err, data) => {
//                 //     if (err) {
//                 //         return console.error(err);
//                 //     }

//                 //     //console.log("Bye!");
//                 // });
//             });
//         }
//         catch (err) {
//             console.log("err get", err);
//         }

//     }
// }

// downloadFiles();

// // for(let i = 1; i < 200; i++){
// //     downloadFiles(i);
// // }
//setInterval(downloadFiles, 100);