
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'lookfantastic',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "li[class*='productListProducts_product'] , div.noresults",
    noResultsXPath: null,
    domain: 'lookfantastic.com.au',
    zipcode: '',
    openSearchDefinition: {
      template: 'https://www.lookfantastic.com.au/elysium.search?search={searchTerms}&pageNumber={page}',
      },
  },
};
