const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'transgourmet',
    transform,
    domain: 'transgourmet.de',
    zipcode: "''",
  },
};
