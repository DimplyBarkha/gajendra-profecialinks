module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage_10101',
    nextLinkSelector: 'div[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.nested_grid_content',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    openSearchDefinition: null,
    domain: 'staplesadvantage.com',
    zipcode: '10101',
  },
};
