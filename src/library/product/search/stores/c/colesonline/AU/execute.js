
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline',
    domain: 'shop.coles.com.au',
    // url: 'https://shop.coles.com.au/a/national/everything/search/{searchTerms}?pageNumber=1',
    url: 'https://shop.coles.com.au/a/alexandria/everything/search/{searchTerms}?pageNumber=1',
    loadedSelector: "section[id*='product-list']",
    noResultsXPath: "//span[contains(@id,'emptyCatalogEntryList')] | //h1[contains(@class,'heading-error-404')] | //div[contains(@class,'error-wrapper')]",
    zipcode: '',
  },
};
