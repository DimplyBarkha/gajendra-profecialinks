
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PE',
    store: 'falabella',
    domain: 'falabella.com.pe',
    url: 'https://www.falabella.com.pe/falabella-pe/search?Ntt={searchTerms}',
    loadedSelector: 'div[id=testId-searchResults-products]',
    noResultsXPath: "//div[contains(@class,'no-result')]",
    zipcode: '',
  },
};
