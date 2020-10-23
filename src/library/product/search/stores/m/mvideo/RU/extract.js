const { cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: cleanUp,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
