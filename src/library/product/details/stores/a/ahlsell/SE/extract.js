const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlsell',
    transform,
    domain: 'ahlsell.se',
    zipcode: "''",
  },
};
