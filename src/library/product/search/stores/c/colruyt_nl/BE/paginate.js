
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'colruyt_nl',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.card__image',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"assortment-overview__sorting")]//span[contains(text(),"0 producten")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.colruyt.be/nl/producten?page={page}&searchTerm={searchTerms}',
    },
    domain: 'colruyt.be',
    zipcode: '',
  },
};
