const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ColoradoDockets',
    transform,
    domain: 'courts.state.co.us',
    zipcode: "''",
  },
};
