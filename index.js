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
