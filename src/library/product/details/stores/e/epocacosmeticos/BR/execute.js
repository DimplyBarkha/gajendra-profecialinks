
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    domain: 'epocacosmeticos.com',
    loadedSelector: 'strong.skuBestPrice',
    noResultsXPath: '//h3[@class="nave-title"]',
    zipcode: '',
  },
};
