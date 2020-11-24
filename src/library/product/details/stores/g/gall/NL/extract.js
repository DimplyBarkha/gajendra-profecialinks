const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'gall',
    transform,
    domain: 'gall.nl',
    zipcode: "''",
  },
};
