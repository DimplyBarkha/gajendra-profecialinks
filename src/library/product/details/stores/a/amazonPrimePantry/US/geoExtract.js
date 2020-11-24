const { implementation } = require('../../../a/amazon/US/extract');
const { transform } = require('../../../../sharedAmazon/transformNew');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonPrimePantry',
        transform,
        domain: 'amazon.com',
        zipcode: ''
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
        goto: 'action:navigation/goto',
    },
    implementation,
};