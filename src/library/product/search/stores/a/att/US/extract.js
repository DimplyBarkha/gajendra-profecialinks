const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'att',
    transform: transform,
    domain: 'att.com',
    zipcode: "''",
  },
};
