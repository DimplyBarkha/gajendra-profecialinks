const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    transform,
    domain: 'k-ruoka.fi',
    zipcode: '',
  },
};
