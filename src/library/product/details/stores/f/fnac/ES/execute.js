
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    loadedSelector: 'div.productPageTop',
    noResultsXPath: '//body[@class="home-page"]',
    zipcode: '',
  },
};
