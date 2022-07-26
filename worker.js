const zmq = require("zeromq");
const sock1 = zmq.socket('pull');
const sock2 = zmq.socket('push');

var rates = {};
var json_data = {};
var data = {};

const api_url = "https://v6.exchangerate-api.com/v6/5a9d162dd5f3cf2295879f06/latest/USD";

fetch_rates();

async function fetch_rates() {
    let response = await fetch(api_url);
    response = await response.json();
    rates = response.conversion_rates;
    console.log("\nJSON DATA:\n", rates);
}

function convert_rates(val, from_currency, to_currency) {
    let currency_value = (val / rates[from_currency]) * rates[to_currency];
    let precised_value = currency_value.toFixed(5);
    return precised_value;
}

run();
setTimeout(run2, 1000);
setTimeout(send_msg, 1000);

async function run() {
    sock1.connect("tcp://127.0.0.1:5000");
    console.log("Connected to server on port 5000!");
    sock1.on('message', function(msg) {
        json_data = msg.toString();
        data = JSON.parse(json_data);
        console.log("\nReceived JSON data:\n", data);
    });
}

async function run2() {
    sock2.bind("tcp://127.0.0.1:5005");
    console.log("\n\n\nServer is ready and listening on port 5005!");
}

function send_msg() {
    console.log("\nPress any key to start sending the JSON!");
    process.stdin.once("data", send);
}

async function send() {
    var from_curr = data.from_currency;
    var to_curr = data.to_currency;
    var stock_price = parseFloat(data.price);
    var amount = data.quantity;

    var conversion_rate = convert_rates(stock_price, from_curr, to_curr);
    var rate = conversion_rate * amount;
    data.conversion_rate = parseFloat(rate);
    console.log("Updated Data:\n", data);

    console.log("\nSending JSON data to client...");
    sock2.send(JSON.stringify(data)); // sending JSON data back
}