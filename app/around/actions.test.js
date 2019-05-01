const { expect } = require('chai');
const { compare } = require('./actions');

const record = {
	date: '2019-04-11',
	facebook: '1',
	pinterest: '1',
	reddit: '1',
	title: 'title 1',
	twitter: '1',
	url: 'https://www.source1.fr',
};
const totalEngagementsSource1 = ['10', '50', '100', '1000', '10000', '100000'];
const totalEngagementsSource2 = ['11', '50', '250', '1111', '11111', '111111'];
const records = [];
totalEngagementsSource1.forEach(totalEngagements => records.push(Object.assign({}, record, { source: 'source1', totalEngagements })));
totalEngagementsSource2.forEach(totalEngagements => records.push(Object.assign({}, record, { source: 'source2', totalEngagements })));

describe('Around actions', () => {
	describe('#compare', () => {
		context('with proper params', () => {
			let results;
			before(() => {
				results = compare(records, 10000);
			});
			it('returns one dataset for each source', () => {
				expect(Object.keys(results)).to.deep.equal(['source1', 'source2']);
			});
			it('returns the record with the closest `totalEngagements` to the given `shares` number', () => {
				const totalEngagements = Object.keys(results).map(source => results[source].totalEngagements);
				expect(totalEngagements).to.deep.equal(['10000', '11111']);
			});
			it('returns proper attributes for each source', () => {
				expect(results).to.deep.equal({
					source1: {
						date: '2019-04-11',
						facebook: '1',
						pinterest: '1',
						reddit: '1',
						title: 'title 1',
						totalEngagements: '10000',
						twitter: '1',
						url: 'https://www.source1.fr',
					},
					source2: {
						date: '2019-04-11',
						facebook: '1',
						pinterest: '1',
						reddit: '1',
						title: 'title 1',
						totalEngagements: '11111',
						twitter: '1',
						url: 'https://www.source1.fr',
					}
				});
			});
		});

		context('when the given `shares` number is a string', () => {
			let results;
			before(() => {
				results = compare(records, '10000');
			});
			it('returns proper results', () => {
				expect(results.source1.totalEngagements).to.equal('10000');
			});
		});

		context('when there are to articles with the same distance between their engagements and the given `shares` number', () => {
			let results;
			before(() => {
				results = compare(records, 75);
			});
			it('returns the one with the highest number of engagement', () => {
				expect(results.source1.totalEngagements).to.equal('100');
			});
		});
	});
});
