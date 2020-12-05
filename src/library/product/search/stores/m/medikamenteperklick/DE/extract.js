const { transform } = require('../../../../../search/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'medikamenteperklick',
    transform: transform,
    domain: 'medikamenteperklick.de',
    zipcode: '',
  },
};
