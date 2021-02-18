const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};

