
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'SE',
    store: 'apotea',
    openSearchDefinition: {
      template: 'https://www.apotea.se/sok?q={searchTerms}&p={page}&x=0&y=0',
    },
    loadedSelector: 'div#search-products div.products5 ul li',
    // nextLinkSelector: 'span.glyphicon-chevron-right',
    spinnerSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    domain: 'apotea.se',
    zipcode: '',
  },
};
