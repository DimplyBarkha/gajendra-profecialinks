const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    transform: transform,
    domain: 'lloydspharmacy.com',
    zipcode: '',
  },
};
