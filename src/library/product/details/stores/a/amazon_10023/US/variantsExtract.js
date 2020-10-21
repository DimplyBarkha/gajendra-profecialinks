const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
    implements: 'product/details/variants/variantsExtract',
    parameterValues: {
        country: 'US',
        store: 'amazon_10023',
        transform: null,
        domain: 'amazon.com',
        zipcode: '10023'
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};