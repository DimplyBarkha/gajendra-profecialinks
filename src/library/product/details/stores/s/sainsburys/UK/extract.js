const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    transform: transform,
    domain: 'sainsburys.co.uk',
    zipcode: '',
  },
};