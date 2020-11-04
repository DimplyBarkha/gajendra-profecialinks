const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../../a/amazon/US/extract')
    // @ts-ignore
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        transform,
        domain: 'amazon.fr',
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
        goto: 'action:navigation/goto',
    },
    implementation,
};