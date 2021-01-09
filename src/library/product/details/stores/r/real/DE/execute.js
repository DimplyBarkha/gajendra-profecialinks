
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'real',
    domain: 'real.de',
    loadedSelector: 'div[class="rd-product-detail"] , h1[class="rd-title"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
