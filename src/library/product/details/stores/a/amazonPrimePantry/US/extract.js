const { transform } = require('../../../../sharedAmazon/transformNew');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry',
        transform,
        domain: 'amazon.com',
        zipcode: '10001',
    },
};