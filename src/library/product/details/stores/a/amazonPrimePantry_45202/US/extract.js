const { transform } = require('./transform');
const { implementation } = require('../shared')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry_45202',
        transform,
        domain: 'amazon.com',
        zipcode: '45202',
    },
    implementation,
};