
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'molsoncoors',
    nextLinkSelector: 'button.show_more_products',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: '#overlay',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//*[contains(text(), "No Results Found")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mymolsoncoors.com',
    zipcode: "''",
  },
};
