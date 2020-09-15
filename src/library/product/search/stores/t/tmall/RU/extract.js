const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform,
    domain: 'tmall.ru',
    zipcode: "''",
  },
};
