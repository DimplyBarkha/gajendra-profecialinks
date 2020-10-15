const { transform } = require('./transform');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry_45202',
        transform,
        domain: 'amazon.com',
        zipcode: '45202',
    },
};