const { transform } = require('../transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'FR',
        store: 'amazonMediaTracker',
        transform,
        domain: 'amazon.fr',
        zipcode: '',
    },
};