var fs = require('fs');
var sonInstrument = JSON.parse(fs.readFileSync('sonInstrument.json', 'utf8'));
const uuidv1 = require('uuid/v1');


// We use a standard Node.js module to work with UDP
const dgram = require('dgram');
// Let's create a datagram socket. We will use it to send our UDP datagrams
const s = dgram.createSocket('udp4');
// Create a measure object and serialize it to JSON
const measure = new Object();

argInstrument = process.argv[2];

measure.uuid = uuidv1();
measure.sound = sonInstrument[argInstrument];


console.log(measure.uuid);
console.log(measure.sound);


const payload = JSON.stringify(measure);

// Send the payload via UDP (multicast)
message = new Buffer.from(payload);

    setInterval(function(){
        s.send(message, 0, message.length, 1234, "224.0.0.0",function(err, bytes) {
        console.log("Sending payload: " + payload + " via port 1234" );
    });},1000);


    
