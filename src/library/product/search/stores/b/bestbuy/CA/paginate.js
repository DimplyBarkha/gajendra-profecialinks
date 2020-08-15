
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    timeout: 30000,
    // nextLinkSelector: 'button.loadMore_3AoXT',
    // mutationSelector: 'button.loadMore_3AoXT',
    spinnerSelector: null,
    loadedSelector: 'div[class="productList_31W-E"]',
    noResultsXPath: '//body[@id="page-not-found"]',
    openSearchDefinition: null,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
