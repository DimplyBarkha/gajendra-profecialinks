const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.es',
    zipcode: '',
  },
};
