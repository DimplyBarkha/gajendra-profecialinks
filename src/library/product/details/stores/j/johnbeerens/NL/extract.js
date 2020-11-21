const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'johnbeerens',
    transform,
    domain: 'johnbeerens.com',
    zipcode: '',
  },
};
