
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'albertsons',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'picture[class*="product-image product-image"]>img',
    noResultsXPath: "//h1[contains(text(),'No results')]",
    openSearchDefinition: null,
    domain: 'albertsons.com',
    zipcode: '83642',
  },
};
