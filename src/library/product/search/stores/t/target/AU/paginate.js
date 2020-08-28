
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'target',
    nextLinkSelector: 'a[title="Next Page"][class="RefineMenu-arrow refine-arrow next"]',
    noResultsXPath: '//div[contains(@class,"ga-no-results")]//h3',
    loadedSelector: 'div.product-listing ul li:nth-last-child(1)',
    domain: 'target.com.au',
    zipcode: '',
  },
};
