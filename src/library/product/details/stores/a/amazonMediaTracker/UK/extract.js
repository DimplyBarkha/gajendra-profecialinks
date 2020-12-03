const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'UK',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.co.uk',
        zipcode: '',
    },
};