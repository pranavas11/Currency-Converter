const zmq = require("zeromq");
const sock1 = zmq.socket("push");
const sock2 = zmq.socket("pull");

var json_data = {
    "name": "Facebook",
    "price": 182.15,
    "quantity": 5,
    "from_currency": "USD",
    "to_currency": "EUR"
};

const fs = require('fs');
let file = "Placeholder text";

run();

async function run() {
    sock1.bind("tcp://127.0.0.1:5000");
    console.log("Server is ready and listening on port 5000!");
    console.log("Press any key to start sending the stock data!");
    process.stdin.once("data", send);
}

async function send() {
    console.log("About to send stock data to user!");
    sock1.send(JSON.stringify(json_data)); // sending currency information
    console.log("Press enter to continue!");
    process.stdin.once("data", run2);
}

async function run2() {
    sock2.connect("tcp://127.0.0.1:5005");
    console.log("Connected to server!");

    sock2.on('message', function(msg) {
        file = JSON.parse(msg.toString());
    });

    console.log("Press any key to print the data!");
    process.stdin.once("data", print_data);
}

async function print_data() {
    console.log(file);
    var data = JSON.stringify(file, null, 4);

    fs.writeFile('./stock.json', data, (err) => {
        if (err) {
            console.log(`\nError writing file: ${err}`);
        } else {
            console.log(`\nFile is written successfully!`);
        }
    });
}

// https://media.oregonstate.edu/media/t/1_aa8euy0f