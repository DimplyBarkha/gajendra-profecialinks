
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'sanalmarket',
    domain: 'migros.com.tr',
    loadedSelector: 'div.product-cover div.owl-item.active img',
    noResultsXPath: '//h2[text()="404"]',
    zipcode: '',
  },
};
