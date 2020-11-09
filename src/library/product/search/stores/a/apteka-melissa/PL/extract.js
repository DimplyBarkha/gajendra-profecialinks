const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    transform,
    domain: 'apteka-melissa.pl',
    zipcode: '',
  },
};
