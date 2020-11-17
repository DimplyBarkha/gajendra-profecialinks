const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    transform,
    domain: 'galaxus.ch',
    zipcode: "''",
  },
};
