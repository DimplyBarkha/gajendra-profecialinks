const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'IT',
    domain: 'amazon.it',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
