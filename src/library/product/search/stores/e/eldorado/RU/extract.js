const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform: cleanUp,
    domain: 'eldorado.ru',
    zipcode: '',
  },
};
