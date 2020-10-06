const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    transform,
    domain: 'breuninger.de',
    zipcode: '',
  },
};
