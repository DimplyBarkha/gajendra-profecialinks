const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    transform: cleanUp,
    domain: 'officemag.ru',
    zipcode: '',
  },
};
