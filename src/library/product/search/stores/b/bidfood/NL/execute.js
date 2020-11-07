
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bidfood',
    domain: 'bidfood.nl',
    url: 'https://www.bidfood.nl/webshop/assortiment?Ntt={searchTerms}',
    loadedSelector: 'div#main',
    noResultsXPath: '//span[@class="search-result-count" and text()=0]',
    zipcode: '',
  },
};
