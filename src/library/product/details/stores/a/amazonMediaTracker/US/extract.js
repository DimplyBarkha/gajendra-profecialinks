const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.com',
        zipcode: '',
    },
};