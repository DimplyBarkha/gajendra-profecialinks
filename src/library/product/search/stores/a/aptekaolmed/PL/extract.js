const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    transform,
    domain: 'aptekaolmed.pl',
    zipcode: '',
  },
};
