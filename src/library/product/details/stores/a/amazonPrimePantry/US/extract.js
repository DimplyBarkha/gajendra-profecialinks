const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../shared');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry',
        transform,
        domain: 'amazon.com',
        zipcode: '10001',
    },
    implementation,
};