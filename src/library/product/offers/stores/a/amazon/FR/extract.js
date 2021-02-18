const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.fr',
    zipcode: '',
  },
};
