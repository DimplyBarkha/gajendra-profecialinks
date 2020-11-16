const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    transform,
    domain: 'hoogvliet.com',
    zipcode: '',
  },
};
