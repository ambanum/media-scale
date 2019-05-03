const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');

describe('API', () => {
	describe('/around/', () => {
		const apiURL = '/media-scale/1.0/around';
		const validRegionCode = 'fr';
		const invalidRegionCode = 'frr';
		const notAlreadySupportedRegionCode = 'es';
		const validShares = 10100;
		const invalidShares = 'test';
		let status;
		let body;
		context('with no query params', () => {
			before(async () => {
				({ status, body } = await request(app).get(apiURL));
			});

			it('responds with 400 HTTP code', () => expect(status).to.equal(400));
			it('responds with errors explaining that `region` and `shares` params are missing', () => {
				expect(body).to.deep.equal({ errors: ['missing param `region`', 'missing param `shares`'] });
			});
		});

		context('with missing `region` params', () => {
			before(async () => {
				({ status, body } = await request(app).get(apiURL).query({ shares: validShares }));
			});

			it('responds with 400 HTTP code', () => expect(status).to.equal(400));
			it('responds with errors explaining that `region` param is missing', () => {
				expect(body).to.deep.equal({ errors: ['missing param `region`'] });
			});
		});

		context('with missing `shares` params', () => {
			before(async () => {
				({ status, body } = await request(app).get(apiURL).query({ region: validRegionCode }));
			});

			it('responds with 400 HTTP code', () => expect(status).to.equal(400));
			it('responds with errors explaining that `shares` param is missing', () => {
				expect(body).to.deep.equal({ errors: ['missing param `shares`'] });
			});
		});

		context('with bad formatted params', () => {
			context('with wrong `region`', () => {
				before(async () => {
					({ status, body } = await request(app).get(apiURL).query({ region: invalidRegionCode, shares: validShares }));
				});

				it('responds with 400 HTTP code', () => expect(status).to.equal(400));
				it('responds with errors explaining that `region` param is an invalid region code', () => {
					expect(body).to.deep.equal({ errors: ['invalid region code'] });
				});
			});

			context('with wrong format for `shares`', () => {
				before(async () => {
					({ status, body } = await request(app).get(apiURL).query({ region: validRegionCode, shares: invalidShares }));
				});

				it('responds with 400 HTTP code', () => expect(status).to.equal(400));
				it('responds with errors explaining that `shares` param is invalid', () => {
					expect(body).to.deep.equal({ errors: ['invalid `shares` format, number > 0 expected'] });
				});
			});
		});

		context('with not already supported region', () => {
			before(async () => {
				({ status, body } = await request(app).get(apiURL).query({ region: notAlreadySupportedRegionCode, shares: validShares }));
			});

			it('responds with 404 HTTP code', () => expect(status).to.equal(404));
			it('responds with errors explaining that the region is not found', () => {
				expect(body).to.deep.equal({ errors: ['region not found'] });
			});
		});

		context('with proper query params', () => {
			before(async () => {
				({ status, body } = await request(app).get(apiURL).query({ region: validRegionCode, shares: validShares }));
			});

			it('responds with 200 HTTP code', () => expect(status).to.equal(200));
			it('responds with comparable articles', () => {
				expect(body).to.deep.equal({
					'Le monde': {
						date: '2019-04-11',
						facebook: '14526',
						pinterest: '167',
						reddit: '5674',
						title: 'Benoît XVI attribue la pédophilie dans l’Eglise à Mai 68 et à « l’absence de Dieu »',
						totalEngagements: '12310',
						twitter: '51658',
						url: 'https://www.lemonde.fr/societe/article/2019/04/11/benoit-xvi-attribue-la-pedophilie-dans-l-eglise-a-mai-68-et-a-l-absence-de-dieu_5449019_3224.html',
					},
					Libération: {
						date: '2019-02-13',
						facebook: '14526',
						pinterest: '167',
						reddit: '36543',
						title: 'Accès à l’eau et changement climatique au Sahel : «Le plus simple est de fabriquer des citernes»',
						totalEngagements: '13310',
						twitter: '51658',
						url: 'https://www.liberation.fr/planete/2019/05/01/acces-a-l-eau-et-changement-climatique-au-sahel-le-plus-simple-est-de-fabriquer-des-citernes_1724175',
					}
				});
			});
		});
	});
});
