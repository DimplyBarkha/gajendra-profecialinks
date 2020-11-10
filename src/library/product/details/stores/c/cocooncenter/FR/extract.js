const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'cocooncenter',
    transform,
    domain: 'cocooncenter.com',
    zipcode: "''",
  }
};
