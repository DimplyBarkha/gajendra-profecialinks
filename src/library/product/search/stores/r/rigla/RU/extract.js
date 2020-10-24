const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    transform,
    domain: 'rigla.ru',
    zipcode: "''",
  },
};
