
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    nextLinkSelector: 'a[data-test="next"]',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div[data-test="productGridContainer"] li',
    noResultsXPath: '//h1[contains(.,"no results found")]',
    // openSearchDefinition: null,
    domain: 'target.com',
    zipcode: '',
  },
};
