const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'SE',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.se',
    zipcode: '',
  },
};
