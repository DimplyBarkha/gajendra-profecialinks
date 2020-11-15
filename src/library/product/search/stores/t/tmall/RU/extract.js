const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform: transform,
    domain: 'tmall.ru',
    zipcode: '',
  },
};
