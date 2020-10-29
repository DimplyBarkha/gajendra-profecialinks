const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    transform,
    domain: 'worlddutyfree.com',
    zipcode: '',
  },
};
