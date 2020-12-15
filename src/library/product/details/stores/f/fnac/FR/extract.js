const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    transform,
    domain: 'fnac.com',
    zipcode: '',
  },
};
