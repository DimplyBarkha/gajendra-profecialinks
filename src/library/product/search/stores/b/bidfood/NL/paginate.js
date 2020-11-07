
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bidfood',
    nextLinkSelector: 'a[data-original-title="Volgende pagina"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#main',
    noResultsXPath: '//span[@class="search-result-count" and text()=0]',
    openSearchDefinition: null,
    domain: 'bidfood.nl',
    zipcode: '',
  },
};
