const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'CA',
        domain: 'amazon.ca',
        zipcode: 'M3H0C3'
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};