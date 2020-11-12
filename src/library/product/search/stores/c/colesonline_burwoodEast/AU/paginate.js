
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_burwoodEast',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "section[id*='product-list']",
    noResultsXPath: "//span[contains(@id,'emptyCatalogEntryList')] | //h1[contains(@class,'heading-error-404')] | //div[contains(@class,'error-wrapper')]",
    openSearchDefinition: {
      template: 'https://shop.coles.com.au/a/burwood-east/everything/search/{searchTerms}?pageNumber={page}',
    },
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
};
