const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'perekrestok',
    transform: null,
    domain: 'vprok.ru',
    zipcode: '',
  },
};
