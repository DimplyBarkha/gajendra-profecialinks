const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'vardex',
    transform,
    domain: 'vardex.ru',
    zipcode: '',
  },
};
