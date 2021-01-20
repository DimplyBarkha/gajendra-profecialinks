
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    nextLinkSelector: ".pagination:first-child >div.arrow.right>button",
    mutationSelector: null,
    spinnerSelector: "div.loader",
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'no-result')]",
    openSearchDefinition: null,
    domain: 'falabella.com.co',
    zipcode: '',
  },
};
