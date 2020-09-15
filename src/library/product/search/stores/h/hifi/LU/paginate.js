
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    nextLinkSelector: 'div[class~="pagination"] a[class~="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class~="products-overview"] > div[class~="row"] > div  img[class~="product-image"]',
    noResultsXPath: '//div[contains(@class,"no-result-content")]',
    openSearchDefinition: null,
    domain: 'hifi.lu',
    zipcode: '',
  },
};
