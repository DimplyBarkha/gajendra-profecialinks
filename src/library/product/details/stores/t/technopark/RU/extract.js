const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'technopark',
    transform: transform,
    domain: 'technopark.ru',
    zipcode: '',
  },
};
