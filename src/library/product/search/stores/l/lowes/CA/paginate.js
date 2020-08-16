
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    nextLinkSelector: 'ul li[class~="next-item"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="tab-products-wrapper"] > ul > li , span[itemprop="name"]',
    noResultsXPath: '//div[@id="products-tab"]//p[contains(@class,"search-results-nothing-found")]',
    openSearchDefinition: null,
    domain: 'lowes.ca',
    zipcode: '',
  },
};
