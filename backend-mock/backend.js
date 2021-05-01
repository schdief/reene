var formidable = require('formidable'),
        http = require('http'),
        util = require('util');
const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }

    // This if statement is here to catch form submissions, and initiate multipart form data parsing.
    if (req.method.toLowerCase() == 'post') {
        // Instantiate a new formidable form for processing.
        var form = new formidable.IncomingForm();
        // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
        form.parse(req, function(err, fields, files) {
            if (err) {
                // Check for and handle any errors here.
                console.error(err.message);
                return;
              }
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');

            //log received data
            console.log(util.inspect({fields: fields, files: files}))
            // This last line responds to the form submission with a list of the parsed data and files.
            res.end(util.inspect({fields: fields, files: files}));
        });
        return;
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`dreckweg.dresden.de-mock is running on http://${host}:${port}`);
});