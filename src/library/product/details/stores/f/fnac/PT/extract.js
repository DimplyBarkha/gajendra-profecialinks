const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    transform,
    domain: 'fnac.pt',
    zipcode: '',
  },
};
