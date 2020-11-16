const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl_fr',
    transform,
    domain: 'iciparisxl_fr.be',
    zipcode: "''",
  },
};
