const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'utkonos',
    transform,
    domain: 'utkonos.ru',
    zipcode: '',
  },
};
 