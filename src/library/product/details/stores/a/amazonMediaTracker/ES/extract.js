const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.es',
        zipcode: '',
    },
};