
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    nextLinkSelector: 'a[aria-label="Next"],a[title="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-section="gridview"] > div[data-component="productpod"], div[class="product-result__wrapped-results"] div.product-pod',
    noResultsXPath: '//h1[contains(@class,"results-nrf-hero__text")]',
    openSearchDefinition: null,
    domain: 'homedepot.com',
  },
};
