const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    transform: transform,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
};
