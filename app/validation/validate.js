const fs = require('fs');
const parse = require('csv-parse');
const validator = require('validator');
const config = require('config');

const FIELDS = config.get('CSVFields');
const URL_OPTIONS = {
	protocols: ['http', 'https'],
	require_tld: true,
	require_protocol: false,
	require_host: true,
	require_valid_protocol: true,
	allow_underscores: false,
	host_whitelist: false,
	host_blacklist: false,
	allow_trailing_dot: false,
	allow_protocol_relative_urls: false,
	disallow_auth: true
};
function isHeaderFieldsValid(record) {
	let result = true;
	FIELDS.forEach((fieldName) => {
		if (record[fieldName] !== fieldName) {
			result = false;
		}
	});

	return result;
}

function isSharesValid(shares) {
	if (!shares) {
		return false;
	}
	return validator.isInt(shares, { min: 0 });
}

function isCountryValid(country) {
	return validator.isISO31661Alpha2(country);
}

function isSourceValid(source) {
	if (validator.isNumeric(source)) {
		return false;
	}
	if (validator.isURL(source, URL_OPTIONS)) {
		return false;
	}
	return typeof source === 'string';
}

function isDateValid(date) {
	return validator.isISO8601(date);
}

function isTitleValid(title) {
	if (validator.isNumeric(title)) {
		return false;
	}
	if (validator.isURL(title, URL_OPTIONS)) {
		return false;
	}
	return typeof title === 'string';
}

function isUrlValid(url) {
	return validator.isURL(url, URL_OPTIONS);
}

async function validate(path) {
	return new Promise((resolve) => {
		const parser = parse({
			delimiter: config.get('CSVDelimiter'),
			columns: FIELDS,
			info: true
		});

		const errors = [];
		parser.on('readable', () => {
			let entry;
			// eslint-disable-next-line no-cond-assign
			while (entry = parser.read()) {
				const { record, info } = entry;
				const {
					totalEngagements,
					facebook,
					twitter,
					pinterest,
					reddit,
					country,
					source,
					date,
					title,
					url
				} = record;

				if (info.lines === 1) {
					if (!isHeaderFieldsValid(record)) {
						errors.push('Error on line 1: Headers fields are invalid');
					}
				} else {
					if (!isSharesValid(totalEngagements)) {
						errors.push(`Error on line ${info.lines}, 'TotalEngagements' field is not a number: ${totalEngagements}`);
					}

					if (!isSharesValid(facebook)) {
						errors.push(`Error on line ${info.lines}, 'Facebook' field is not a number: ${facebook}`);
					}

					if (!isSharesValid(twitter)) {
						errors.push(`Error on line ${info.lines}, 'Twitter' field is not a number: ${twitter}`);
					}

					if (!isSharesValid(pinterest)) {
						errors.push(`Error on line ${info.lines}, 'Pinterest' field is not a number: ${pinterest}`);
					}

					if (!isSharesValid(reddit)) {
						errors.push(`Error on line ${info.lines}, 'Reddit' field is not a number: ${reddit}`);
					}

					if (!isCountryValid(country)) {
						errors.push(`Error on line ${info.lines}, 'Country' field is not a valid country code: ${country}`);
					}

					if (!isSourceValid(source)) {
						errors.push(`Error on line ${info.lines}, 'Source' field is not a string: ${source}`);
					}

					if (!isDateValid(date)) {
						errors.push(`Error on line ${info.lines}, 'Date' is not in ISO 8061 format: ${date}`);
					}

					if (!isTitleValid(title)) {
						errors.push(`Error on line ${info.lines}, 'Title' field is not a string: ${title}`);
					}

					if (!isUrlValid(url)) {
						errors.push(`Error on line ${info.lines}, 'Url' is invalid: ${url}`);
					}
				}
			}
		});

		parser.on('error', (err) => {
			errors.push(err.message);
		});

		const file = fs.readFileSync(path);
		parser.write(file);
		parser.end(() => resolve({ errors }));
	});
}

module.exports = {
	validate
};
