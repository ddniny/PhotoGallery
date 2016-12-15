const port = 3000,
    serverUrl = "127.0.0.1";
    http = require("http"),
    path = require("path"),
    fs = require("fs"); // TODO: Add to package file

console.log("Starting web server at " + serverUrl + ":" + port);

http.createServer( function(req, res) {
	let filename = req.url === "/" ? "/index.html" : req.url;
	let ext = path.extname(filename);
	let localPath = __dirname;
	let validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
        ".json": "application/json"
        // ".txt": "text/plain",
        // 	".jpg": "image/jpeg",
        // 	".gif": "image/gif",
        // 	".png": "image/png"
	};

	let mimeType = validExtensions[ext];

	if (mimeType) {
        localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});
	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	}
}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType) {
                res.setHeader("Content-Type", mimeType);
			}

			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}