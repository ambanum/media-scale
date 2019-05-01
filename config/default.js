const config = {
	CSVFields: ['totalEngagements', 'facebook', 'twitter', 'pinterest', 'reddit', 'country', 'source', 'date', 'title', 'url'],
	CSVDelimiter: ';',
	supportedCountries: ['fr'],
	dataFilePaths: {
		fr: './data/fr.csv'
	}
};

module.exports = config;
