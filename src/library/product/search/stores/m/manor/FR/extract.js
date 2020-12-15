const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
