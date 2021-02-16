/** @format */

const { transform } = require('../BE/format');
module.exports = {
	implements: 'product/details/extract',
	parameterValues: {
		country: 'BE',
		store: 'delhaize',
		transform,
		domain: 'delhaize.be',
		zipcode: '',
	},
	implementation: async (inputs, parameters, context, dependencies) => {
		try {
			await context.waitForXPath(
				'//div[contains(@class,"ShowMoreLess__content")]//h3[contains(text(), "Gebru")]/following::p[1]'
			);
		} catch (error) {
			console.log('Error in Loading Instructions :', error);
		}
		const { transform } = parameters;
		const { productDetails } = dependencies;
		return await context.extract(productDetails, { transform });
	},
};
