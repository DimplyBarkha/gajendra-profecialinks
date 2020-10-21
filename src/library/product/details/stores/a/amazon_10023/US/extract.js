const { transform } = require('../transform');
const { implementation } = require('../sharedExtract')
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
        store: 'amazon_10023',
        transform,
        domain: 'amazon.com',
        zipcode: '10023'
    },
    dependencies: {
        productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};