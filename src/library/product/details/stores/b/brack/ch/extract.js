const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ch',
    store: 'brack',
    transform: transform,
    domain: 'brack.ch',
    zipcode: "''",
  },
};
