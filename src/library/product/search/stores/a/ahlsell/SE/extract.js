const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlsell',
    transform,
    domain: 'ahlsell.se',
    zipcode: "''",
  },
};
