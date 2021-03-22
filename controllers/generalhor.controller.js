'use strict'
var fs = require('fs');
const ExcelJS = require('exceljs');

var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

var controller_generalhor =
{
	generateExcel: (req, res) => {
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
	},
	getFile: (req, res) => {
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
	}
}
module.exports = controller_generalhor;