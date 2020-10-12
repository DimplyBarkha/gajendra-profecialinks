const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'b-apteka',
    transform,
    domain: 'b-apteka.ru',
    zipcode: "''",
  },
};
