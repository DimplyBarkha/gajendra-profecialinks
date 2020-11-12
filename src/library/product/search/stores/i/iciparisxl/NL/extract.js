const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'iciparisxl',
    transform,
    domain: 'iciparisxl.nl',
    zipcode: "''",
  },
};