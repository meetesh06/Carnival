const express        = require('express');
const app            = express();
const port 			 = process.env.PORT || 6969;

require('./app/routes/routes')(app);
	
app.listen(port, () => {
	console.log('We are live on ' + port);
});