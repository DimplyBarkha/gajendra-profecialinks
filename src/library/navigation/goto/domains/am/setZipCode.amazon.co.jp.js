const { implementation } = require('../../../../helpers/amazonZipImplementation');

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'JP',
    domain: 'amazon.co.jp',
    store: 'amazon',
    zipcode: '',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
