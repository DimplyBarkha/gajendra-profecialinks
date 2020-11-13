const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    transform,
    domain: 'petshop.ru',
    zipcode: '',
  },
};
