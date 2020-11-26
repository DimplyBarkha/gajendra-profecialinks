
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    domain: 'falabella.com',
    url: 'https://www.falabella.com/falabella-cl/search?Ntt={searchTerms}',
    loadedSelector: 'div[id=testId-searchResults-products]',
    noResultsXPath: "//div[contains(@class,'no-result')]",
    zipcode: '',
  },
};
