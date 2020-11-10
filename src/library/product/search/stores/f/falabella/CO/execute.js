
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    domain: 'falabella.com.co',
    url: 'https://www.falabella.com.co/falabella-co/search?Ntt={searchTerms}',
    loadedSelector: 'div[id=testId-searchResults-products]',
    noResultsXPath: "//div[contains(@class,'no-result')]",
    zipcode: '',
  },
};
