const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../../a/amazon/US/extract')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        transform,
        domain: 'amazon.fr',
        zipcode: '75019',
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
        goto: 'action:navigation/goto',
    },
    implementation,
};