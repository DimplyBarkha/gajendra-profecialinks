const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'AU',
        domain: 'amazon.au',
        zipcode: ''
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};