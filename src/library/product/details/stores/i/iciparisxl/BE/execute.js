const { transform } = require('./format');
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl',
    domain: 'iciparisxl.be',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
};