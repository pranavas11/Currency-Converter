const fs = require('fs');
var webpage = fs.readFileSync("./webpage.html");
var css = fs.readFileSync("./styles.css");
var js = fs.readFileSync("./currency_converter.js");
var http = require('http');

var server = http.createServer(function(request, response) {
    if (request.url === "/") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end(webpage);
        return;
    }

    if (request.url === "/styles.css") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/css");
        response.end(css);
        return;
    }

    if (request.url === "/currency_converter.js") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/javascript");
        response.end(js);
        return;
    }

    if (request.url === "/json_data") {
        request.on("data", chunk => {
            var json = JSON.parse(chunk.toString());
            fs.writeFile('./currency.json', JSON.stringify(json, null, 4), (err) => {
                if (err) {
                    console.log(`\nError writing file: ${err}`);
                } else {
                    console.log(`\nCurrency.json file is written successfully!`);
                }
            });
            console.log("\nCurrency data:", chunk.toString());
        });
        response.end("Received GET request.");
    }
});

server.listen(5000, () => { console.log("\nWebsite is available at localhost:5000/") });