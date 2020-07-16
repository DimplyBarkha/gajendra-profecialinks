const { transform } = require('../../../../shared');
const { implementation } = require('../../kroger/US/sharedSearchExtract');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger_45044',
    transform,
    domain: 'kroger.com',
    zipcode: '45044',
  },
  implementation,
};
