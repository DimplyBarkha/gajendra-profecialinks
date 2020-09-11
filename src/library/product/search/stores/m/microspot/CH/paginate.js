
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    nextLinkSelector: 'li[class="K2DOit"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#container-productlist > div:last-child img',
    noResultsXPath: '//*[contains(text(),"Tipps für Ihre Suche:")]',
    openSearchDefinition: null,
    domain: 'microspot.ch',
    zipcode: '',
  },
};
