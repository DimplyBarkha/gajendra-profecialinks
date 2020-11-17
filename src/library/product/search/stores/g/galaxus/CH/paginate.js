
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productList.ZZ7t',
    noResultsXPath: '//h2[contains(text(),"Tipps für deine Suche")]',
    openSearchDefinition: null,
    domain: 'galaxus.ch',
    zipcode: "''",
  },
};
