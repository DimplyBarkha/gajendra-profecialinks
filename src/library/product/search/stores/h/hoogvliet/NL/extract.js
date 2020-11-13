const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    transform,
    domain: 'hoogvliet.com',
    zipcode: "''",
  },
};
