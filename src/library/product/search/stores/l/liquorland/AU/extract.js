const { transform } = require('./format.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    transform,
    domain: 'liquorland.com.au',
    zipcode: "''",
  },
};
