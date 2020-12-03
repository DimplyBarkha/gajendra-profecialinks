const { transform } = require('../../amazonMediaTracker/transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonLgMediaTracker',
        transform,
        domain: 'amazon.com',
        zipcode: '',
    },
};