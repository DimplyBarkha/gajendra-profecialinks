const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    transform,
    domain: 'zdravcity.ru',
    zipcode: '',
  },
};
