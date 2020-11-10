
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    nextLinkSelector: "div.arrow right",
    mutationSelector: "//div[contains(@class,'search-results--actionbar')and not(contains(@class,'bottom'))]//div[contains(@class,'pagination')]/ol",
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'no-result')]",
    openSearchDefinition: null,
    domain: 'falabella.com.co',
    zipcode: '',
  },
};
