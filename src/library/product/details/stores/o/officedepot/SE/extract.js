const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'officedepot',
    transform,
    domain: 'officedepot.se',
    zipcode: '',
  },
};
