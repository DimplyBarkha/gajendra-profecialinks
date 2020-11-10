const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl',
    transform,
    domain: 'iciparisxl.be',
    zipcode: "''",
  },
};