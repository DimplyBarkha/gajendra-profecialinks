const { transform } = require('../../../../shared');
const createSearchUrl = require('../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'ES',
        store: 'elcorteingles_perfumeria',
        transform,
        domain: 'elcorteingles.es',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(() => { createSearchUrl });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};