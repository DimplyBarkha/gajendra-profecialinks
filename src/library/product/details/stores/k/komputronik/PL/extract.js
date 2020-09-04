const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    transform,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
};
