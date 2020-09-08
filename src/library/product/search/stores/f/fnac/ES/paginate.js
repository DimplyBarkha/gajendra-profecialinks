
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    nextLinkSelector: 'li.nextLevel1',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.Article-item[id]',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    openSearchDefinition: null,
    domain: 'fnac.es',
    zipcode: '',
  },
};
