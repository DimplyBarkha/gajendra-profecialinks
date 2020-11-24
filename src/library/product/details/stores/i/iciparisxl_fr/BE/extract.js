const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl_fr',
    transform,
    domain: 'iciparisxl_fr.be',
    zipcode: "''",
  },
};
