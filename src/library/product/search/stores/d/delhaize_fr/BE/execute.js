
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_fr',
    domain: 'delhaize.be',
    url: 'https://www.delhaize.be/fr-be/shop/search?q={searchTerms}',
    loadedSelector: 'div.ProductSearchResultsPage',
    noResultsXPath: '//div[@class="ResultAmount-container"]/span[@class="ResultAmount" and starts-with(text(),"0 résultats pour")]',
    zipcode: '',
  },
};
