const { transform } = require('../transform');
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
