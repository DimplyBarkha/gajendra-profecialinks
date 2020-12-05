const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    transform: transform,
    domain: 'eapteka.ru',
    zipcode: '',
  },
};
