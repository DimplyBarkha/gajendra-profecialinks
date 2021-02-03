
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'meijer_49684',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,//'div.product-item',
    loadedXpath: null,
    noResultsXPath: null,//"//div[@class='search-empty row ']",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.meijer.com/shop/en/search/?q={serchTerms}&page={page}',
    },
    domain: 'meijer.com',
    zipcode: '',
  },
};
