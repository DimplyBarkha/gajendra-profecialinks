const transform = require('./format');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'yandex',
    transform: transform,
    domain: 'yandex.ru',
    zipcode: '',
  },
};
