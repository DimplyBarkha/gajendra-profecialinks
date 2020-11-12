const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'iciparisxl',
    transform,
    domain: 'iciparisxl.nl',
    zipcode: "''",
  },
};