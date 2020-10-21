const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'CA',
        domain: 'amazon.ca',
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};