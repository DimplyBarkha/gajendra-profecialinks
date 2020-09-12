
const { transform } = require('../transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: "''",
  },
};

