const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    transform,
    domain: 'arco.co.uk',
    zipcode: '',
  },
};
