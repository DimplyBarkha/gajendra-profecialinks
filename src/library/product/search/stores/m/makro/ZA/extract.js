const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'makro',
    transform,
    domain: 'makro.co.za',
    zipcode: '',
  },
};
