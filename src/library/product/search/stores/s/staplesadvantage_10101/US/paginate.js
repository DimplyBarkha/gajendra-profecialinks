
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage_10101',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,

    loadedSelector: 'div.nested_grid_content',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    openSearchDefinition: {
      template: 'https://www.staplesadvantage.com/search?pn={page}&term={searchTerms}',
    },
    domain: 'staplesadvantage.com',
    zipcode: '10101',
  },
};
