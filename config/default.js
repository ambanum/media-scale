const config = {
	CSVFields: ['totalEngagements', 'facebook', 'twitter', 'pinterest', 'reddit', 'country', 'source', 'date', 'title', 'url'],
	CSVDelimiter: ';',
	supportedCountries: ['fr', 'gb'],
	scale: [50, 100, 200, 300, 400, 500, 1000, 2000, 4000, 6000, 10000, 15000, 20000, 40000, 60000, 100000, 150000, 200000, 400000, 600000, 1000000, 10000000],
	dataFilePaths: {
		fr: './data/fr.csv',
		gb: './data/gb.csv'
	}
};

module.exports = config;
