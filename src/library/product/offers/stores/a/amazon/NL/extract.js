const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.nl',
    zipcode: '',
  },
};
