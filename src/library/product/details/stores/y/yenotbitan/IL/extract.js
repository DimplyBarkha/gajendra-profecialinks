const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'yenotbitan',
    transform,
    domain: 'ybitan.co.il',
    zipcode: '',
  },
};
