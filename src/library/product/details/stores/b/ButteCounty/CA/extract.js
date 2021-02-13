const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'ButteCounty',
    transform,
    domain: 'cabutteodyprod.tylerhost.net',
    zipcode: "''",
  },
};
