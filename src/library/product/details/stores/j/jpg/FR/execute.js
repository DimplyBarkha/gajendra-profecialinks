
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    loadedSelector: 'div[class="flex"]',
    noResultsXPath: '//body[@id="error-404"]|//header[@class="search-noresult my-3"]/h3/text()',
    zipcode: '',
  },
};
