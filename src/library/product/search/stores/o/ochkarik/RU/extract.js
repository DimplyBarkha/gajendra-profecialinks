const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'ochkarik',
    transform,
    domain: 'ochkarik.ru',
    zipcode: '',
  },
};
