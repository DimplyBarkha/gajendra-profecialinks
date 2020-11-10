const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    transform,
    domain: 'exito.com',
    zipcode: "''",
  },
};
