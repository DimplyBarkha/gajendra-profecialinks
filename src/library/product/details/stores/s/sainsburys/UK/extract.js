const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    transform,
    domain: 'sainsburys.co.uk',
    zipcode: '',
  },
};
