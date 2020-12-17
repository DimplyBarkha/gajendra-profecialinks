
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staples',
    nextLinkSelector: 'div[aria-label = "Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    // openSearchDefinition: null,
    // openSearchDefinition: {
    //   offset: 24,
    //   template: 'https://www.staples.com/11%20x%2017%20copy%20paper/directory_{searchTerms}?pn={page}&offset={offset}',
    // },
    domain: 'staples.com',
    zipcode: '',
  },
};
