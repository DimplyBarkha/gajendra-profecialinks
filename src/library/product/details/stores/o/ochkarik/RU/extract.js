const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'ochkarik',
    transform,
    domain: 'ochkarik.ru',
    zipcode: '',
  },
};
