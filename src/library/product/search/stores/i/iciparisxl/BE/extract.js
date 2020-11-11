const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl',
    transform,
    domain: 'iciparisxl.be',
    zipcode: "''",
  },
};