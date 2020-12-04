
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'linenchest_fr_ca',
    domain: 'linenchest.com',
    url: 'https://www.linenchest.com/fr_ca/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'ol.ais-Hits-list li.ais-Hits-item',
    noResultsXPath: '//div[@class="no-results"]//b[contains(.,"Aucun produit pour")]',
    zipcode: '',
  },
};
