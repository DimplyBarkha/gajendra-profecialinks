
const { transform } = require('../formatAe');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    transform,
    domain: 'noon.com/saudi-en/',
    zipcode: "''",
  },
};

