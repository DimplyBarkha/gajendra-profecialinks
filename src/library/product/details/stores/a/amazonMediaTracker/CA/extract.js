const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'CA',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.ca',
        zipcode: '',
    },
};