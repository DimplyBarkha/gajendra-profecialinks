const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    transform,
    domain: 'galaxus.ch',
    zipcode: "''",
  },
};
