
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id="searchList"]',
    noResultsXPath: '//div[contains(text(), "Leider keine Artikel gefunden.")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'shop.mpreis.at',
    zipcode: '',
  },
};
