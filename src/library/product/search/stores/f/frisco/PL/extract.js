const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    transform: transform,
    domain: 'frisco.pl',
  },
};