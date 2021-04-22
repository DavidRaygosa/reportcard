'use strict'
var fs = require('fs');
const ExcelJS = require('exceljs');
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

var controller_generalhor =
{
	generateExcel: (req, res) => {
		if(auth(req)){
			let blob = req.body.data;
			let turn = req.body.turn;
			let filePath = './uploads/HORARIO GENERAL1 - ' + turn + '.xlsx';
			let filename = 'HORARIO GENERAL1 - ' + turn;
			const workbook = new ExcelJS.Workbook();
			workbook.xlsx.load(blob.data).then(() => {
				workbook.xlsx.writeFile(filePath).then(() => {
					return res.status(200).send({ filename: filename });
				});
			});
		} else res.status(401).send('Unauthorized');
	},
	getFile: (req, res) => {
		if(auth(req)){
			let nameFile = req.params.fileName;
			let isPDF = req.params.isPDF;
			let filePath = "./uploads/" + nameFile + '.xlsx';
			if (isPDF == 'false') {
				res.download(filePath);
				setTimeout(() => {
					fs.unlink(filePath, (error) => { });
				}, 1000);
			}
			if (isPDF == 'true') {
				let dir = './uploads/' + nameFile + '.pdf';
				// Configure API key authorization: Apikey
				let Apikey = defaultClient.authentications['Apikey'];
				Apikey.apiKey = 'b209384a-28d1-4ecc-9c37-181d9630fd4b';
				let apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
				let inputFile = Buffer.from(fs.readFileSync(filePath).buffer); // File | Input file to perform the operation on.
				let callback = function (error, data, response) {
					if (error) console.log(error);
					else {
						fs.writeFileSync(dir, data);
						res.download(dir);
						setTimeout(() => {
							fs.unlink(filePath, (error) => { });
							fs.unlink(dir, (error) => { });
						}, 1000);
					}
				};
				apiInstance.convertDocumentXlsxToPdf(inputFile, callback);
			}
		} else res.status(401).send('Unauthorized');
	}
}
module.exports = controller_generalhor;