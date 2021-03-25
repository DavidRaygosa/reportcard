'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;
app.set('port', process.env.PORT || port);
// SERVER TO AWS

mongoose.Promise = global.Promise;

//THIS LINE TO CONNECT ATLAS DB
mongoose.connect('mongodb+srv://davidr97:Azullindo55@prepa114-cluster.pggki.mongodb.net/prepa114db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
		.then
		(
			() =>
				{
					console.log("Conexion a la base de datos establecida satisfactoriamente...");
					app.listen(app.get('port'), () => 
					{
 						console.log("Servidor Corriendo Correctamente En Puerto: "+app.get('port'));
					});
				}
		)

		.catch(error => console.log(error));

/*THIS LINE TO CONNECT LOCAL DB
mongoose.connect('mongodb://localhost:27017/projectdb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
		.then
		(
			() =>
				{
					console.log("Conexion a la base de datos establecida satisfactoriamente...");
					app.listen(app.get('port'), () => 
					{
 						console.log("Servidor Corriendo Correctamente En Puerto: "+app.get('port'));
					});
				}
		)

		.catch(error => console.log(error));
*/

/* THIS LINE TO CONNECT WITHOUT DB
app.listen(app.get('port'), () => 
{
		console.log("Servidor Corriendo Correctamente En Puerto: "+app.get('port'));
});
*/