
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'deebee',
    domain: 'deebee.co.uk',
    url: "https://www.deebee.co.uk/product/search/q/{searchTerms}#page-head",
    loadedSelector: "div#product-results",
    noResultsXPath: "//div[@id='content-center']//div[contains(@class, 'page-header')]//h2[@id='page-head']",
    zipcode: '',
  },
};