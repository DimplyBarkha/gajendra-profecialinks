const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'lastprice',
    transform: transform,
    domain: 'lastprice.co.il',
    zipcode: '',
  },
};
