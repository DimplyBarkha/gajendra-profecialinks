const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.com',
    zipcode: '',
  },
};
