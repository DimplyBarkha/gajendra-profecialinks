const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    transform: cleanUp,
    domain: 'komus.ru',
    zipcode: '',
  },
};
