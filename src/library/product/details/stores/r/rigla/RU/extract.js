const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    transform,
    domain: 'rigla.ru',
    zipcode: "''",
  },
};
