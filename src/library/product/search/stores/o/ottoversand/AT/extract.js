const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    transform,
    domain: 'ottoversand.at',
    zipcode: '',
  },
};
