const { transform } = require('./format');
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
