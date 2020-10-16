const { transform } = require('../../../../sharedAmazon/transformNew');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonApparel',
        transform,
        domain: 'amazon.com',
    },
};