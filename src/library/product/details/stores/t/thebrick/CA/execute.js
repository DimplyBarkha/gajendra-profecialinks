
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'thebrick',
    domain: 'thebrick.com',
    loadedSelector: 'div[class*="pro_main_c"]',
    noResultsXPath: '//div[@id="core_404"]',
    zipcode: '',
  },
};
