const { transform } = require('../../../../../search/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'medikamenteperklick',
    transform: transform,
    domain: 'medikamenteperklick.de',
    zipcode: '',
  },
};
