const { transform } = require('../shared');

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'NL',
        store: 'albertheijn',
        transform,
        domain: 'ah.nl',
    },
}