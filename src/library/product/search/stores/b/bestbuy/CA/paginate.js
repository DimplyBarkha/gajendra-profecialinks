
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    timeout: 30000,
    nextLinkSelector: 'button[class*="loadMore"]',
    // mutationSelector: 'button.loadMore_3AoXT',
    spinnerSelector: 'div[role="progressbar"]',
    // loadedSelector: 'div[class*="productListItem"]:nth-last-child(1)',
    noResultsXPath: '//body[@id="page-not-found"]',
    openSearchDefinition: null,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
