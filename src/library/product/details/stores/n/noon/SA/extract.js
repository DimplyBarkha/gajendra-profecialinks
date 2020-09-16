
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: "''",
  },
};