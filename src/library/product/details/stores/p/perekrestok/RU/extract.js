const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'perekrestok',
    transform: null,
    domain: 'vprok.ru',
    zipcode: '',
  },
};
