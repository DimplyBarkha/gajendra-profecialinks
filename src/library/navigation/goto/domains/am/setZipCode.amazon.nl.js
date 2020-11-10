const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'NL',
    domain: 'amazon.nl',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
