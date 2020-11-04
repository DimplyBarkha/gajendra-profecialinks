const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../../../a/amazon/US/extract')
    /**
     *
     * @param { { url?: string,  id?: string} } inputs
     * @param { Record<string, any> } parameters
     * @param { ImportIO.IContext } context
     * @param { Record<string, any> } dependencies
     */

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazon',
        transform,
        domain: 'amazon.ca',
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};