
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-section="gridview"] > div[data-component="productpod"]',
    noResultsXPath: '//h1[contains(@class,"results-nrf-hero__text")]',
    openSearchDefinition: null,
    domain: 'homedepot.com',
  },
};
