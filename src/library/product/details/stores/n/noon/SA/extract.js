
const { transform } = require('../formatVariants');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    transform,
    domain: 'noon.com/saudi-en/',
    zipcode: "''",
  },
};