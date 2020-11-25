const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'tottus',
    transform,
    domain: 'tottus.cl',
    zipcode: '',
  },
};
