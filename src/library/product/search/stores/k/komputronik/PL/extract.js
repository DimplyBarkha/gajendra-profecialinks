const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    transform,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
};
