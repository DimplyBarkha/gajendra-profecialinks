const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'tiendasjumbo',
    transform: null,
    domain: 'tiendasjumbo.co',
    zipcode: "''",
  },
};
