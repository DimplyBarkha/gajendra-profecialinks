const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    transform,
    domain: 'safeway.com',
    zipcode: '',
  },
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
    // createUrl: 'action:product/details/createUrl',
  },
};
