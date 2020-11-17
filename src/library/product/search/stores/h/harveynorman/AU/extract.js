const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.com.au',
    zipcode: "''",
  },
};
