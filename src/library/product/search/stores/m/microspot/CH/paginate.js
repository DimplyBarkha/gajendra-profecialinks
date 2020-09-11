
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    nextLinkSelector: 'li[class="K2DOit"]:last-child a button:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#container-productlist > div:last-child img',
    noResultsXPath: '//*[contains(text(),"Tipps für Ihre Suche:")]',
    openSearchDefinition: null,
    domain: 'microspot.ch',
    zipcode: '',
  },
};
