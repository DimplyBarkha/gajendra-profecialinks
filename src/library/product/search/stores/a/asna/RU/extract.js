const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'asna',
    transform,
    domain: 'asna.ru',
    zipcode: '',
  },
};
