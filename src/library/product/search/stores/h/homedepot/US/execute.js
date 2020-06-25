
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    domain: 'homedepot.com',
    url: 'https://www.homedepot.com/s/{searchTerms}',
    loadedSelector: 'div[data-section="gridview"] > div[data-component="productpod"]',
    noResultsXPath: '//h1[contains(@class,"results-nrf-hero__text")]',
  },
};
