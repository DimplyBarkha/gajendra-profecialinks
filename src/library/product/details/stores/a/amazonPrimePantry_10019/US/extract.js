const { transform } = require('./transform');
const { implementation } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry_10019',
        transform,
        domain: 'amazon.com',
        zipcode: '10019',
    },
    implementation,
};