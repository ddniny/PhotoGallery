const port = 3000,
    http = require("http"),
    path = require("path"),
    fs = require("fs"); 

console.log("Starting web server at port:" + port);

http.createServer(function(req, res) {
    console.log(req.method);
    
	let filename = req.url === "/" ? "/index.html" : req.url;
	let ext = path.extname(filename);
	let localPath = __dirname;
	let validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
		".ico": "image/x-icon",
        ".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif"
        	
	};

	let mimeType = validExtensions[ext];

	if (mimeType) {
        localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.error("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});
	} else {
		console.error("Invalid file extension detected: " + ext + " (" + filename + ")")
	}
}).listen(process.env.PORT || port); 

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