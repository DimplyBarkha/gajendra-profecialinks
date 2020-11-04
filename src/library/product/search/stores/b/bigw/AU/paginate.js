
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-listing',
    noResultsXPath: '//h3[contains(text(),"Sorry, your search for did not return any results")]',
    openSearchDefinition: null,
    domain: 'bigw.com.au',
    zipcode: "''",
  },
};
