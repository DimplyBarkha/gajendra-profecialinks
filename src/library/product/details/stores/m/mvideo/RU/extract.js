const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
