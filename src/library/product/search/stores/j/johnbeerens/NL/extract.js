const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'johnbeerens',
    transform,
    domain: 'johnbeerens.com',
    zipcode: "''",
  },
};
