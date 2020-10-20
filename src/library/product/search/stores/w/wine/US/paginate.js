
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wine',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.prodList',
    noResultsXPath: "//div[contains(@class,'noSearchResults-showing')]",
    openSearchDefinition: null,
    domain: 'wine.com',
    zipcode: '',
  },
};
