const { implementation } = require('./setZipCode.amazon.com');

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    domain: 'amazon.ca',
    country: 'CA',
    store: 'amazon',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
