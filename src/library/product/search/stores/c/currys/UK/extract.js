const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: "''",
  },
};
