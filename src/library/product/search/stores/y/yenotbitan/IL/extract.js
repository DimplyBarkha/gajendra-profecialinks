const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'yenotbitan',
    transform,
    domain: 'ybitan.co.il',
    zipcode: '',
  },
};
