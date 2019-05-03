const config = require('config');
const parse = require('csv-parse');
const fs = require('fs');

function compare(records, shares) {
	const result = {};
	// make a copy to allow reversing the array not in place
	const scaleMinBoundary = config.get('scale').slice().reverse().find(value => value < shares);
	const scaleMaxBoundary = config.get('scale').find(value => shares <= value);

	records.forEach((record) => {
		// if record is outside boundaries, nothing to do
		if (record.totalEngagements <= scaleMinBoundary || record.totalEngagements > scaleMaxBoundary) {
			return;
		}

		const previous = result[record.source];

		// if there is not already a result for this source, save it
		if (!previous) {
			result[record.source] = {
				totalEngagements: record.totalEngagements,
				facebook: record.facebook,
				twitter: record.twitter,
				pinterest: record.pinterest,
				reddit: record.reddit,
				date: record.date,
				title: record.title,
				url: record.url,
			};
			return;
		}

		const distanceFromRecordToSharesNumber = Math.abs(record.totalEngagements - shares);
		const distanceFromPreviousSavedResultToSharesNumber = Math.abs(previous.totalEngagements - shares);
		const isClosest = distanceFromRecordToSharesNumber < distanceFromPreviousSavedResultToSharesNumber;
		if (isClosest || ((distanceFromRecordToSharesNumber === distanceFromPreviousSavedResultToSharesNumber) && Number(record.totalEngagements) > Number(previous.totalEngagements))) {
			result[record.source] = {
				totalEngagements: record.totalEngagements,
				facebook: record.facebook,
				twitter: record.twitter,
				pinterest: record.pinterest,
				reddit: record.reddit,
				date: record.date,
				title: record.title,
				url: record.url,
			};
		}
	});
	return result;
}

async function compareData({ data, shares }) {
	return new Promise((resolve, reject) => {
		const parser = parse({
			delimiter: config.get('CSVDelimiter'),
			columns: config.get('CSVFields')
		}, (err, records) => {
			if (err) {
				reject(err);
			}

			// Remove headers line
			records.splice(0, 1);

			resolve(compare(records, shares));
		});

		parser.write(data);
		parser.end();
	});
}

function compareFile({ region, shares }) {
	const fileContent = fs.readFileSync(config.get(`dataFilePaths.${region}`));
	return compareData({ data: fileContent, shares });
}

module.exports = {
	compare,
	compareData,
	compareFile
};
