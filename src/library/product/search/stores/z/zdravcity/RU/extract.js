const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    transform,
    domain: 'zdravcity.ru',
    zipcode: '',
  },
};
