const express = require('express');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false }) 
const fileUpload = require('express-fileupload');
const fs = require('fs');
const crypto = require('crypto');

module.exports = function(app) {
	app.use(express.static('public'));
	app.set('view engine', 'ejs');
	app.use(fileUpload());

	app.get('/', function(req, res) {
		res.render('index');
	});

	app.post('/', urlencodedParser, function(req, res) {
		console.log(req.body);
	  	if(req.files && req.files.suspect_image) {
	  		var name = Math.random().toString().slice(2,11);
	  		let sampleFile = req.files.suspect_image;
 				sampleFile.mv('./tempImageHolder/'+name+'.jpg', function(err) {
				if (err)
					return res.status(500).send("error");
				// res.send('File uploaded!');
				var PythonShell = require('python-shell');

				var options = {
			      mode: 'text',
			      pythonPath: '/usr/local/bin/python3', 
			      pythonOptions: ['-u'],
			      scriptPath: './',
			      args: [name]
			    };

			    PythonShell.run('recognize.py', options, function (err, results) {
					if (err) throw res.send("ERROR");
					// results is an array consisting of messages collected during execution
					results = uniq(results);
					fs.unlink('./tempImageHolder/'+name+'.jpg');
					
					console.log(results);

					var toSend = {};

					results.forEach(function(element) {
						console.log(element.split("_"));
						var name = crypto.createHash('md5').update(element.split("_")[0]+"_"+element.split("_")[1]).digest('hex');										
						toSend[element] = name;
					});

					// var name = crypto.createHash('md5').update(req.body.suspect_name+"_"+req.body.suspect_id).digest('hex');
					console.log(toSend);
					res.send( { error: false, data: toSend } );
			    	
			    });
			});
	  	} else {
	  		res.send( { error: true, data: uniq(results) } );
	  	}
	});

	app.get('/generate', function(req, res) {
		res.render('generate');
	});

	app.post('/generate', urlencodedParser, function(req, res) {
	  	if(req.files && req.body.suspect_name && req.body.suspect_id && req.files.suspect_image) {
	  		let current = req.files.suspect_image;
			var name = crypto.createHash('md5').update(req.body.suspect_name+"_"+req.body.suspect_id).digest('hex');
			console.log(name);
			current.mv('./public/images/'+name+'.jpg', function(err) {
				if (err)
					return res.status(500).send("error");

				var PythonShell = require('python-shell');

				var options = {
			      mode: 'text',
			      pythonPath: '/usr/local/bin/python3', 
			      pythonOptions: ['-u'],
			      scriptPath: './',
			      args: [name, req.body.suspect_name+"_"+req.body.suspect_id]
			    };
			    PythonShell.run('generateEntry.py', options, function (err, results) {
			    	if(err) {
			    		console.log({  error: true });
			    	}
					console.log(results);				
					res.send( {  error: false } );
			    });
			});
	  	} else {
	  		res.send( {  error: true } );	
	  	}	
	});

};

function uniq(a) {
    return Array.from(new Set(a));
}