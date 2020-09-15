const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
