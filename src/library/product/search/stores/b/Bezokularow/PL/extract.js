const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'Bezokularow',
    transform,
    domain: 'bezokularow.pl',
    zipcode: '',
  },
};
