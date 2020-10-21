const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'asna',
    transform,
    domain: 'asna.ru',
    zipcode: '',
  },
};
