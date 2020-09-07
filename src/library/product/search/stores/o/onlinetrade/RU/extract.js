const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    transform: transform,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
};
