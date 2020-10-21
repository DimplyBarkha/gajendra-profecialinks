const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'ES',
    domain: 'amazon.es',
    store: 'amazon',
    zipcode: '28010',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
