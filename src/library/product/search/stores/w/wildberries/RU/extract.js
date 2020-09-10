const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    transform,
    domain: 'wildberries.ru',
    zipcode: '',
  },
};
