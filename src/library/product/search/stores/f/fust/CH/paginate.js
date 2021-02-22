
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.results  div.product',
    noResultsXPath: '//p[contains(text(),"Es konnte für Ihre Suche leider keine passenden Ergebnisse gefunden werden.")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'fust.ch',
    zipcode: "''",
  },
};
