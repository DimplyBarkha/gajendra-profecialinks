const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.it',
    zipcode: '',
  },
};