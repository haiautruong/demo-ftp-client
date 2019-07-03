var Client = require('ftp');

//link host: https://files.000webhost.com/
const USER = 'haiau762';
const PASSWORD = "haiau@@123";
const HOST = 'files.000webhost.com';
let dir = 'tmp/';
// const USER = 'haiau123';
// const PASSWORD = "123";
// const HOST = 'localhost';
const PORT = 21;

function connect() {
    let client = new Client();
    client.connect({
        host: HOST,
        port: PORT,
        user: USER,
        password: PASSWORD,
        // connTimeout: 10000000
    });
    return client;
}

function getList(client) {
    return new Promise((resolve, reject) => {
        client.list(dir, (err, listFile) => {
            let arrayFile = listFile.filter(elment => (elment.type === '-'));
            if (err) {
                reject(arrayFile);
            }
            else {
                resolve(arrayFile);
            }
        })
    })
}
function downFile(client, fileName) {
    return new Promise((resolve, reject) => {
        client.get(dir + fileName, function (err, stream) {
            if (err) {
                reject(err);
            }
            else {
                // stream.once('close', function () { client.end(); });
                let allData = '';
                stream.on('data', function (data) {
                    allData += data.toString();
                });
                stream.on('end', function () {
                    resolve(allData);
                });
            }
        });
    })
}

function downloadFiles(){
    let client = connect();
    getList(client).then(listFile =>{
        console.log(listFile);
        listFile.forEach(file => {
            downFile(client, file.name).then(data => {
                let arrayData = data.split("\n");
                console.log(arrayData.length);
            })
        });
    })
}

downloadFiles();