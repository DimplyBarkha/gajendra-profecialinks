const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'FR',
        domain: 'amazon.fr',
        timeout: 900000,
        store: 'amazonMweb',
        zipcode: '75019',
    },
    dependencies: {
        Helpers: 'module:helpers/helpers',
        AmazonHelp: 'module:helpers/amazonHelp',
    },
    implementation,
};