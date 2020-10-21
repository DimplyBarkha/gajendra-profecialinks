const { implementation } = require('../../../../sharedAmazon/variantExtract');

module.exports = {
    implements: 'product/details/variants/variantsExtract',
    parameterValues: {
        country: 'CA',
        store: 'amazon',
        transform: null,
        domain: 'amazon.ca',
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};