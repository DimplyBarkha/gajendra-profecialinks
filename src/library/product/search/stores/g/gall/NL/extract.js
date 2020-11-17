const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'gall',
    transform,
    domain: 'gall.nl',
    zipcode: "''",
  },
};
