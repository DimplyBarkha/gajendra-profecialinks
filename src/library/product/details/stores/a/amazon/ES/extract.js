const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../../a/amazon/US/extract')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'amazon',
        transform,
        domain: 'amazon.es',
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};