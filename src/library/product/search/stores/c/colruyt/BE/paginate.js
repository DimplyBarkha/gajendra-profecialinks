module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#articles',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"no-result-page")]',
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.colruyt.be/fr/produits?page={page}&searchTerm={searchTerms}',
    // },
    domain: 'colruyt.be',
    zipcode: '',
  },
};
