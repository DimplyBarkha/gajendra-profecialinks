const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.de',
        zipcode: '',
    },
};