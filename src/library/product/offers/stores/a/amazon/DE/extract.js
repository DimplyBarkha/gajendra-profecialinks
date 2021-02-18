const { transform } = require('../../../../shared');
const { appendOffers } = require('../sharedExtract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    appendOffers,
    domain: 'amazon.de',
    zipcode: '',
  },
};