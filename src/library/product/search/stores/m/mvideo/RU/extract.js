const { transform } = require('../transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
