const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { validate } = require('./validate');

const wellFormattedDBFilePath = 'fixtures/wellFormattedDB.csv';
const badFormattedDBFilePath = 'fixtures/badFormattedDB.csv';
const badHeadersDBFilePath = 'fixtures/badHeadersDB.csv';

describe('Validation', () => {
	describe('#validate', () => {
		context('with properly formatted DB file', () => {
			it('should return OK', async () => {
				const { errors } = await validate(wellFormattedDBFilePath);
				expect(errors).to.be.empty;
			});
		});

		context('with bad headers DB file', () => {
			let errors;
			before(async () => {
				({ errors } = await validate(badHeadersDBFilePath));
			});
			it('should return an error headers', () => {
				expect(errors).to.includes('Error on line 1: Headers fields are invalid');
			});
		});

		context('with bad formatted DB file', () => {
			let errors;
			before(async () => {
				({ errors } = await validate(badFormattedDBFilePath));
			});
			it("should return an error for 'TotalEngagements' field", () => {
				expect(errors).to.includes("Error on line 2, 'TotalEngagements' field is not a number: 1a267");
			});
			it("should return an error for 'Facebook' field", () => {
				expect(errors).to.includes("Error on line 2, 'Facebook' field is not a number: true");
			});
			it("should return an error for 'Twitter' field", () => {
				expect(errors).to.includes("Error on line 2, 'Twitter' field is not a number: 5165d8");
			});
			it("should return an error for 'Pinterest' field", () => {
				expect(errors).to.includes("Error on line 2, 'Pinterest' field is not a number: 16..7");
			});
			it("should return an error for 'Reddit' field", () => {
				expect(errors).to.includes("Error on line 2, 'Reddit' field is not a number: 567d4");
			});
			it("should return an error for 'Country' field", () => {
				expect(errors).to.includes("Error on line 2, 'Country' field is not a valid country code: frr");
			});
			it("should return an error for 'Date' field", () => {
				expect(errors).to.includes("Error on line 2, 'Date' is not in ISO 8061 format: 2019-34-11");
			});
			it("should return an error for 'Source' field", () => {
				expect(errors).to.includes("Error on line 3, 'Source' field is not a string: https://www.lemonde.fr");
			});
			it("should return an error for 'Title' field", () => {
				expect(errors).to.includes("Error on line 3, 'Title' field is not a string: 13467");
			});
			it("should return an error for 'Url' field", () => {
				expect(errors).to.includes("Error on line 3, 'Url' is invalid: //www.liberation.fr/france/2019/04/26/a-notre-dame-de-paris-il-est-venu-le-temps-des-horlogers_1723627");
			});
		});
	});
});

describe('Data validation', () => {
	const files = fs.readdirSync('./data/');
	files.filter(file => path.extname(file).toLowerCase() === '.csv').forEach((file) => {
		context(`with '/data/${file}' file`, () => {
			it('returns no errors', async () => {
				const { errors } = await validate(`./data/${file}`);
				expect(errors).to.be.empty;
			});
		});
	});
});
