const {transform} = require('../transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform,
    domain: 'tmall.ru',
    zipcode: "''",
  },
};
