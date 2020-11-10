const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    transform,
    domain: 'aptekagemini.pl',
    zipcode: '',
  },
};
