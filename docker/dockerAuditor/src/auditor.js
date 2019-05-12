// We use a standard Node.js module to work with UDP
const dgram = require('dgram');
const net = require('net');
const moment = require('moment');
var fs = require('fs');
var sonInstrument = JSON.parse(fs.readFileSync('sonInstrument.json', 'utf8'));

// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
const s = dgram.createSocket('udp4');
s.bind(1234, function() {
 console.log("Joining multicast group");
 s.addMembership("224.0.0.0");
});

//var array = new Array;
var array = [];
var lastActive = [];
var i = 0;
// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source IP: " + source.address  + source.port);

    const musician = new Object();
    

    var response = JSON.parse(msg);

    musician.uuid = response["uuid"];
    sound = response["sound"];
    musician.instrument = sonInstrument[musician.sound];

    switch(sound){

        case "ti-ta-ti":
        
        musician.instrument = "piano";
        break;

        case "pouet":

        musician.instrument = "trumpet";
        break;

        case "trulu":

        musician.instrument = "flute";
        break;

        case "gzi-gzi":

        musician.instrument = "violin";
        break;

        case "boum-boum":

        musician.instrument = "drum";
        break;

        default :
        musician.instrument = "inconnu";
        break;

    }

    
 
    var find = false;

    for(var j = 0; j <  array.length; j++){
        console.log(array[j]);
        if(array[j]['uuid'] == musician.uuid){
            find = true;
            console.log("caca");
            lastActive[j] =  moment().format();
        }
    }

    if(!find || array.length == 0){
        musician.activeSince =  moment().format();
        console.log(musician.activeSince);
        array.push(musician);
        lastActive.push(moment().format());
    }

    console.log(musician.uuid);
    console.log(sound);
    console.log(musician.instrument);

    console.log(array);

});

setInterval(function(){
    for(var j = 0; j <  array.length; j++){
       console.log(lastActive[j]);
       console.log( moment().format());
    
        if(moment().diff(lastActive[j]) > 5000){
            console.log(array[j] + "is removed");
            delete array[j];
            delete lastActive[j];

            for(var z = j ; z < array.length - 1; z++){
                array[z] = array[z+1];
                lastActive[z] = lastActive[z+1];
            }
            array.pop();
            lastActive.pop();
        }
    }},1000);



var server = net.createServer(function(socket) {
	socket.write(JSON.stringify(array));
    socket.destroy();
});

var tcpServer = net.createServer();
tcpServer.listen(2205);
console.log("TCP Server now running on port : 2205" );

tcpServer.on('connection', function (socket) {

    socket.write(JSON.stringify(array));
    socket.destroy();
});


