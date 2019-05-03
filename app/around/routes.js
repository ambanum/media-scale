const express = require('express');
const validator = require('validator');
const config = require('config');
const actions = require('./actions');

const router = express.Router();
const supportedCountries = config.get('supportedCountries');

router.get('/around', async (req, res, next) => {
	const { region, shares } = req.query;
	const errors = [];

	if (!region || region === 'undefined') {
		errors.push('missing param `region`');
	}

	if (region && region !== 'undefined' && !validator.isISO31661Alpha2(region)) {
		errors.push('invalid region code');
	}

	if (!shares) {
		errors.push('missing param `shares`');
	}

	if (shares && !validator.isInt(shares, { min: 0 })) {
		errors.push('invalid `shares` format, number > 0 expected');
	}

	if (errors.length) {
		return res.status(400).json({ errors });
	}

	if (region && validator.isISO31661Alpha2(region) && !supportedCountries.find(countryCode => countryCode === region)) {
		return res.status(404).json({ errors: ['region not found'] });
	}

	const result = await actions.compareFile({ region, shares });

	return res.json(result);
});

module.exports = router;
