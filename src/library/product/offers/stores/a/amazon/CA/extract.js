const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.ca',
    zipcode: '',
  },
};
