module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    nextLinkSelector: 'li[class="nextLevel1 "] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article[class*="Article-itemGroup"]',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    openSearchDefinition: null,
    domain: 'fnac.pt',
    zipcode: '',
  },
};
