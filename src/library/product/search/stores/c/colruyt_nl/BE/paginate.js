
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'BE',
    store: 'colruyt_nl',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#articles',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"no-result-page")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.colruyt.be/nl/producten?page={page}&searchTerm={searchTerms}',
    // },
    domain: 'colruyt.be',
    zipcode: '',
  },
};
