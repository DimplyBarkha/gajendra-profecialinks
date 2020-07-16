const { transform } = require('../../../../shared');
const { implementation } = require('./sharedSearchExtract');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
  },
  implementation,
};
