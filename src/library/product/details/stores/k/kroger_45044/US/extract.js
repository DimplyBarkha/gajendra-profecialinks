const { implementation } = require('../../kroger/US/sharedExtract');
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger_45044',
    transform: cleanUp,
    domain: 'kroger.com',
    zipcode: '45044',
  },
  implementation,
};
