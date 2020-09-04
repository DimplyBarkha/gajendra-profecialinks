const {transform} = require('../transform')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: "''",
  },
};
