const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: transform,
    domain: 'freshamazon.de',
    zipcode: '',
  },
};