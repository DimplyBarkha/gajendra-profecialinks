const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'victoryonline',
    transform: cleanUp,
    domain: 'victoryonline.co.il',
    zipcode: '',
  },
};
